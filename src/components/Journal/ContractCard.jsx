import monsters from "../../data/monster.json";
import recipes from "../../data/recipes.json";

const ContractCard = ({ contractData, activeContractData, mode }) => {
  const isCompleted = mode === "completed";
  const currentProgress = isCompleted ? contractData.target_qty : (activeContractData?.progress || 0);

  return (
    <div className={`border ${isCompleted ? "border-green-300" : "border-neutral-600"}  rounded-md items-center p-4 flex flex-col w-[300px]`}>
      
      <div className="flex flex-col items-center w-full">
        <p className="font-bold text-lg text-amber-300 witcher-font text-center">
          {contractData.name}
        </p>
        <div className="mb-2 mt-4 flex flex-col items-center">
          <img
            src={`./images/${contractData.target_monster}.png`}
            className={`h-[180px] object-contain drop-shadow-lg transition-all ${isCompleted ? 'grayscale-[30%]' : ''}`}
            alt={contractData.target_monster}
          />
          <p className="witcher-font text-xl mt-2 text-neutral-200">
            {monsters[contractData.target_monster]?.name}
          </p>
        </div>
      </div>

      <div className="border-t border-t-neutral-700 w-full py-4 text-center mt-auto">
        
        <p className="text-neutral-300">
          Reward:{" "}
          <span className={`font-bold transition-colors ${isCompleted ? "text-green-400" : "text-amber-400"}`}>
            {contractData.reward_coins}🪙, {contractData.reward_exp} XP
          </span>
        </p>
        
        <div className="flex mt-3 items-center gap-3 justify-center text-neutral-300">
          <span>Recipes: </span>
          <span className="flex flex-col gap-2 flex-wrap justify-center ">
            {contractData.reward_recipe && contractData.reward_recipe.length > 0
              ? contractData.reward_recipe.map((recipe) => (
                <span 
                  key={recipe} 
                  className={`rounded-[100vw] font-semibold text-neutral-300 bg-neutral-900 border text-xs p-1 px-3 transition-colors ${
                    isCompleted ? "border-green-400" : "border-neutral-600 "
                  }`}
                >
                  {recipes[recipe]?.name}
                </span>
              ))
              : <span className="text-neutral-500 italic text-sm">None</span>}
          </span>
        </div>
      </div>

      <p className="text-neutral-300 w-full text-center">
        Progress:{" "}
        <span
          className={`font-bold transition-colors ${
            isCompleted || currentProgress >= contractData.target_qty 
              ? "text-green-400" 
              : "text-red-400"
          }`}
        >
          {currentProgress} / {contractData.target_qty}
        </span>
      </p>

    </div>
  );
};

export default ContractCard;