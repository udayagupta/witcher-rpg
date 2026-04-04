import itemsData from "../../data/items.json";
import Icon from '../Icon';
import { getPlayerQty, validateIngredients } from '../../utils/utils';
import { usePlayerStore } from "../../store/usePlayerStore";
import IngredientCard from "./IngredientCard";

const RecipePop = ({ recipeData, playerInventory, onClose }) => {
  
  const recipeItemData = itemsData[recipeData.subType][recipeData.id];
  const canCraft = validateIngredients(playerInventory, recipeData.ingredients);

  const craftItem = usePlayerStore((state) => state.craftItem);

  return (
    <div className="relative text-2xl bg-neutral-900 border border-neutral-700 flex flex-col mt-5 lg:flex-row max-w-[680px] min-h-[350px] p-5 rounded-lg shadow-2xl text-white">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-neutral-500 hover:text-white cursor-pointer transition-colors p-1"
        title="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Left Panel - Item Details */}
      <div className='flex-[1.5] h-full flex flex-col pr-5'>
        <h4 className='witcher-font text-3xl text-amber-300'>{recipeData.name}</h4>
        <p className="text-[12px] text-neutral-400 uppercase tracking-widest mt-0.5 font-semibold">
          {recipeData.type.replace(/([A-Z])/g, ' $1').trim()}
        </p>
        
        <div className="my-4">
          <Icon id={recipeData.id} type={recipeData.type} size={80} />
        </div>
        
        <p className="text-lg text-neutral-300 italic mb-4 leading-relaxed">
          "{recipeItemData.description}"
        </p>

        <div className="flex justify-between items-end w-full text-[18px] border-t border-neutral-700/50 pt-3 mt-auto mb-4">
          <div className='font-bold flex items-center gap-1'>
            {(recipeItemData.type === "weapon") && (
              <span className="text-red-400" title="Attack Damage">⚔️ {recipeItemData.attack[0]}-{recipeItemData.attack[1]}</span>
            )}
            {(recipeItemData.type === "armor") && (
              <span className="text-blue-400" title="Armor Defense">🛡️ {recipeItemData.defense}</span>
            )}
            {(recipeItemData.type === "food" || recipeItemData.type === "potion") && (
              <span className="text-green-400" title="Healing Amount">❤️ +{recipeItemData.heal || recipeItemData.vitality_regen}</span>
            )}
            {(recipeItemData.type === "resource" || recipeItemData.type === "oil") && (
              <span className="text-neutral-500 font-normal italic">Ingredient</span>
            )}
          </div>
          <span className="text-amber-400 font-bold flex items-center gap-1" title="Value">
            {recipeItemData.price} <span className="text-[12px]">🪙</span>
          </span>
        </div>

        <div className="w-full">
          {canCraft ? (
            <button onClick={() => craftItem(recipeData)} className='w-full py-2.5 rounded-md cursor-pointer bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-500'>
              Craft Item
            </button>
          ) : (
            <div className='w-full py-2.5 bg-neutral-800/50 border border-neutral-700 text-neutral-500 font-bold tracking-wider rounded text-center text-sm uppercase flex items-center justify-center cursor-not-allowed'>
              Not Enough Ingredients
            </div>
          )}
        </div>
      </div>

      <div className="w-px bg-neutral-700/60 my-2 mx-2"></div>

      {/* Right Panel - Ingredients */}
      <div className='flex-1 h-full pl-3 pt-6'>
        <h5 className="text-sm text-neutral-400 uppercase tracking-wider mb-3 font-semibold border-b border-neutral-700/50 pb-2">
          Required Materials
        </h5>
        {/* grid grid-cols-2 */}
        <ul className='flex flex-col lg:grid lg:grid-cols-2 w-full gap-3 text-sm'>
          {
            recipeData.ingredients.map((ingredient) => {
              const ingredientData = itemsData[ingredient.type][ingredient.id];
              const playerQty = getPlayerQty(playerInventory, ingredient);

              return (
                <li key={ingredient.id}>
                  <IngredientCard ingredient={ingredient} ingredientData={ingredientData} playerQty={playerQty}/>
                </li>
              )
            })
          }
        </ul>
      </div>
      
    </div>
  )
}

export default RecipePop;