import React from 'react';
import { usePlayer, usePlayerStore } from '../../store/usePlayerStore';
import contracts from "../../data/contracts.json";
import monstersData from "../../data/monster.json";

const ContractCard = ({ selectedContract }) => {
  const player = usePlayer();
  const acceptContract = usePlayerStore((state) => state.acceptContract);
  const turnInQuest = usePlayerStore((state) => state.turnInQuest);


  if (!selectedContract) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-neutral-300">
        <p>Select a contract to view details.</p>
      </div>
    );
  }

  const selectedContractData = contracts[selectedContract];
  const contractMonster = selectedContractData.target_monster;

  const activeQuestInfo = player.activeQuests[selectedContract];
  const isCompleted = activeQuestInfo?.status === "completed";

  return (
    <div className="flex flex-col gap-3 rounded p-4 bg-neutral-900/30 h-full text-white overflow-auto">
      <h3 className="text-center text-3xl text-amber-300 witcher-font">
        {selectedContractData.name}
      </h3>
      <p className="text-center text-lg opacity-90">{selectedContractData.description}</p>
      
      <div className="flex flex-col text-left mt-2 text-md">
        <p className="flex-1" title="Monster quantity">
          Monster: <span className="font-semibold">{monstersData[contractMonster].name}</span> (x{selectedContractData.target_qty})
        </p>
        <p className="flex-1">
          Reward: <span className="font-semibold">{selectedContractData.reward_coins} crowns</span>
        </p>
      </div>

      <div className="accept-choice mt-3">
        <button
          onClick={() => acceptContract(selectedContract)}
          disabled={!!activeQuestInfo}
          className={`px-4 py-1 rounded font-bold transition ${
            activeQuestInfo 
              ? "opacity-70 bg-neutral-700 cursor-not-allowed" 
              : "text-neutral-900 bg-amber-300 hover:bg-amber-400 cursor-pointer"
          }`}
        >
          {(activeQuestInfo && activeQuestInfo.status !== "completed") ? `Progress: ${activeQuestInfo.progress} / ${activeQuestInfo.required}` : "Accept"}
        </button>
      </div>

      {isCompleted && (
        <button onClick={() => turnInQuest(selectedContract)} className="px-4 py-2 rounded font-bold text-neutral-900 bg-green-500 hover:bg-green-400 cursor-pointer transition">
          Turn In Contract
        </button>
      )}
    </div>
  );
};

export default ContractCard