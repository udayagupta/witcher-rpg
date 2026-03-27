import React, { useEffect, useState } from 'react';
import { usePlayer, usePlayerStore } from '../../store/usePlayerStore';
import recipesData from "../../data/recipes.json";
import RecipeCard from './RecipeCard';
import { validateIngredients } from '../../utils/utils';

const RenderCategory = ({ category }) => {
  const player = usePlayer();
  const recipesUnlocked = usePlayerStore((state) => state.recipesUnlocked);

  // const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categoryRecipes = recipesUnlocked.filter((recipe) => recipesData[recipe].type === category.filterType);

  return (
    <div>
      <ul className='mt-3 flex gap-5'>
        {
          categoryRecipes.map((recipe) => {
            const recipeData = recipesData[recipe];
            const canCraft = validateIngredients(player.inventory, recipeData.ingredients);
            return (
              <li className={`relative flex flex-col justify-between p-3 max-w-max cursor-pointer transition-all group bg-neutral-800/50 border-2 ${canCraft ? "border-green-300" : "border-red-400"} rounded-md`} key={recipeData.id}>
                <RecipeCard recipeData={recipeData}/>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default RenderCategory