import Icon from '../Icon';
import itemsData from "../../data/items.json";
import { getPlayerQty } from '../../utils/utils';
import { usePlayer } from '../../store/usePlayerStore';

const RecipeCard = ({ recipeData }) => {
  const player = usePlayer();

  return (
    <div className=''>
      <div className='flex flex-col items-center mt-1'>
        <Icon id={recipeData.id} type={recipeData.type} size={50} />
        <p className='mt-2 text-sm font-semibold text-neutral-200 text-center leading-tight truncate w-full'>
          {recipeData.name}
        </p>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
          {recipeData.type.replace(/([A-Z])/g, ' $1').trim()}
        </p>
      </div>
      
      <ul className={`grid grid-cols-2 mt-1 w-full gap-2 text-sm border-t border-neutral-700/50 pt-2`}>
        {
          recipeData.ingredients.map((ingredient) => {
            const itemData = itemsData[ingredient.type][ingredient.id];
            const playerQty = getPlayerQty(player.inventory, ingredient);
            return (
              <li
                className='relative flex flex-col h-full w-full justify-between items-center text-center p-2 cursor-pointer transition-all group bg-neutral-900 border border-neutral-700 rounded-md'
                key={ingredient.id}
              >
                <div className='flex flex-1 items-center justify-center aspect-square'>
                  <Icon id={ingredient.id} type={ingredient.type} size={35} />
                </div>                
                <p className='text-sm text-neutral-300 w-full truncate my-1 px-1'>
                  {itemData?.name}
                </p>
                <p className={`w-full border-t border-neutral-700/50 pt-1 ${playerQty >= ingredient.qty ? "text-green-300" : "text-red-400"} font-bold text-sm`}>
                  {playerQty} / {ingredient.qty}
                </p>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default RecipeCard;