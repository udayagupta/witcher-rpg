import { useState } from "react";
import locationsData from "../data/locations.json";
import monstersData from "../data/monster.json";
import { usePlayer } from "../context/PlayerContext/PlayerContext";

const ContractsBoard = ({ playerLocation }) => {
  const contracts = locationsData[playerLocation].contracts;
  const [selectedContract, setSelectedContract] = useState("");
  const { player, acceptContract } = usePlayer()

  const ContractCard = () => {
    if (!selectedContract) {
      return (
        <div className="flex flex-col justify-center items-center h-full text-slate-400">
          <p>Select a contract to view details.</p>
        </div>
      );
    }

    const contractMonster = selectedContract.monster_id;
    const selectedQuestId = selectedContract.questId;

    return (
      <div className="flex flex-col gap-3  rounded-md max-w-max p-3 overflow-auto">
        <h3 className="text-center text-3xl text-orange-400 witcher-font">
          {selectedContract.contract_name}
        </h3>
        <p className="text-center text-xl">{selectedContract.description}</p>
        <div className="flex flex-col text-left">
          <p className="flex-1" title="Monster quantity">
            Monster: {monstersData[contractMonster].name}(s) (
            {selectedContract.monster_quantity})
          </p>
          <p className="flex-1">Reward: {selectedContract.reward} crowns</p>
        </div>
        <div className="accept-choice text-slate-950">
          <button onClick={() => acceptContract(selectedQuestId)} className={`accept cursor-pointer rounded-md bg-orange-400 p-1 px-5 ${player.activeQuests.includes(selectedQuestId) ? "opacity-70" : ""}`}>
            {player.activeQuests.includes(selectedQuestId) ? "Accepted" : "Accept"}
          </button>
        </div>
      </div>
    );
  };

  const selectContract = (contract) => {
    setSelectedContract(contract);
  };


  return (
    <div className="contracts-board h-[500px] text-lg rounded-md gap-5 flex">
      <div className=" flex-2 px-4 border">
        <h3 className="text-2xl p-2 witcher-font">Contracts</h3>
        <ul className="contracts-list">
          {contracts.map((item) => (
            <li
              key={item.questId}
              onClick={() => selectContract(item)}
              className={`contract-li border-2 rounded-md cursor-pointer flex flex-col overflow-hidden  hover:border-orange-400 transition ${
                selectedContract?.questId === item.questId
                  ? "border-orange-400"
                  : "border-slate-700"
              }`}
            >
              <p className="bg-slate-700 p-1 py-2">{item.contract_name}</p>
              <p className="text-[16px] p-2">{item.short_description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 selected-contract border w-[20%] overflow-auto">
        <ContractCard />
      </div>
    </div>
  );
};

export default ContractsBoard;
