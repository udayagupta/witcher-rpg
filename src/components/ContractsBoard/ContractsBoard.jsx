import { useState } from "react";
import locationsData from "../../data/locations.json";
import monstersData from "../../data/monster.json";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const ContractsBoard = () => {
  const [selectedContract, setSelectedContract] = useState("");
  const { player, acceptContract } = usePlayer();
  const contracts = locationsData[player.currentLocation].contracts;

  const ContractCard = () => {
    if (!selectedContract) {
      return (
        <div className="flex flex-col justify-center items-center h-full text-neutral-300">
          <p>Select a contract to view details.</p>
        </div>
      );
    }

    const contractMonster = selectedContract.monster_id;
    const selectedQuestId = selectedContract.questId;

    return (
      <div className="flex flex-col gap-3 rounded p-4 bg-neutral-900/30 h-full text-white overflow-auto">
        <h3 className="text-center text-3xl text-amber-300 witcher-font">
          {selectedContract.contract_name}
        </h3>
        <p className="text-center text-lg opacity-90">{selectedContract.description}</p>
        <div className="flex  flex-col text-left mt-2 text-md">
          <p className="flex-1" title="Monster quantity">
            Monster: <span className="font-semibold">{monstersData[contractMonster].name}</span> (x{selectedContract.monster_quantity})
          </p>
          <p className="flex-1">Reward: <span className="font-semibold">{selectedContract.reward} crowns</span></p>
        </div>
        <div className="accept-choice mt-3">
          <button
            onClick={() => acceptContract(selectedQuestId)}
            className={`px-4 py-1 rounded font-bold text-neutral-900 bg-amber-500 hover:bg-amber-400 transition ${
              player.activeQuests.includes(selectedQuestId) ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
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
    <section className="contracts-board h-full text-lg gap-5 flex bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg p-4">
      <div className="flex-2 px-4">
        <h3 className="text-2xl p-2 witcher-font text-amber-300">Contracts</h3>
        <ul className="contracts-list flex flex-col gap-2">
          {contracts.map((item) => (
            <li
              key={item.questId}
              onClick={() => selectContract(item)}
              className={`contract-li rounded hover:text-amber-300 cursor-pointer flex flex-col overflow-hidden transition p-1 ${
                selectedContract?.questId === item.questId
                  ? "border border-amber-300 bg-neutral-900/20 text-amber-300"
                  : "border border-neutral-700 bg-neutral-900/10 hover:border-amber-300"
              }`}
            >
              <p className="bg-neutral-900/50 p-2 font-semibold witcher-font">{item.contract_name}</p>
              <p className="text-[16px] p-2 opacity-90">{item.short_description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 border border-amber-300 rounded-lg selected-contract w-1/3 overflow-auto">
        <ContractCard />
      </div>
    </section>
  );
};

export default ContractsBoard;
