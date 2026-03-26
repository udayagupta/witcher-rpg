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

  if (player.completedQuests?.includes(selectedContract)) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-neutral-300">
        <p>Contract completed. Select another contract.</p>
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

      <div className="mt-3 flex flex-col gap-2">        
        {!activeQuestInfo && (
          <button
            onClick={() => acceptContract(selectedContract)}
            className="px-4 py-2 rounded font-bold transition text-neutral-900 bg-amber-500 hover:bg-amber-400 cursor-pointer"
          >
            Accept Contract
          </button>
        )}

        {(activeQuestInfo && !isCompleted) && (
          <div
            className="px-4 py-2 rounded font-bold transition opacity-70 bg-neutral-700 cursor-not-allowed text-neutral-300"
          >
            Progress: {activeQuestInfo.progress} / {activeQuestInfo.required}
          </div>
        )}

        {isCompleted && (
          <button 
            onClick={() => turnInQuest(selectedContract)} 
            className="px-4 py-2 rounded font-bold text-neutral-900 bg-green-500 hover:bg-green-400 cursor-pointer transition shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          >
            Turn In Contract
          </button>
        )}

      </div>
    </div>
  );
};

export default ContractCard;