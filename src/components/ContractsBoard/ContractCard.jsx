import { usePlayer, usePlayerStore } from '../../store/usePlayerStore';
import contracts from "../../data/contracts.json";
import monstersData from "../../data/monster.json";
import recipesData from "../../data/recipes.json";


const ContractCard = ({ selectedContract, setSelectedContract }) => {
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

  const onClose = () => { setSelectedContract(null) };

  return (
    <div className="relative bg-neutral-900 border border-neutral-700 flex flex-col w-full max-w-[650px] max-h-[90vh] overflow-y-auto min-h-[350px] p-5 sm:p-8 rounded-lg shadow-2xl text-white">

      <button
        onClick={onClose}
        className="absolute cursor-pointer top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors font-bold text-lg"
        title="Close Details"
      >
        ✕
      </button>

      <h3 className="text-center text-3xl text-amber-300 witcher-font">
        {selectedContractData.name}
      </h3>
      <p className="text-center text-lg opacity-90">{selectedContractData.description}</p>

      <div className="flex flex-col gap-1.5 text-left mt-2 text-md text-neutral-300">

        <p className="flex-1" title="Monster quantity">
          Target: <span className="font-semibold text-neutral-100">{monstersData[contractMonster]?.name}</span> (x{selectedContractData.target_qty})
        </p>

        <p className="flex-1">
          Reward: <span className="font-semibold text-amber-400">{selectedContractData.reward_coins} crowns</span>
        </p>

        <div className='flex flex-wrap items-center gap-2 mt-0.5'>
          <span>Unlocks:</span>
          {selectedContractData.reward_recipe ? (
            selectedContractData.reward_recipe.map((r) => (
              <span
                key={r}
                className='bg-amber-900/30 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md text-xs font-bold tracking-wide shadow-sm'
              >
                {recipesData[r]?.name}
              </span>
            ))
          ) : (
            <span className="font-semibold text-neutral-500">None</span>
          )}
        </div>

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