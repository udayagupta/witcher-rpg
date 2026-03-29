import { useEffect } from 'react';
import Icon from '../Icon';
import itemsData from "../../data/items.json";
import { getPlayerQty } from '../../utils/utils';
import { usePlayer } from '../../store/usePlayerStore';
import IngredientCard from './IngredientCard';

const RecipeCard = ({ recipeData }) => {
  const player = usePlayer();

  useEffect(() => {
    console.log(recipeData);
    console.log(recipeData.id, itemsData[recipeData.subtype]);
  }, [recipeData,]);

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
              <li key={ingredient.id}>
                <IngredientCard ingredient={ingredient} ingredientData={itemData} playerQty={playerQty}/>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default RecipeCard;