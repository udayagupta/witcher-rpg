import React, { useEffect, useState } from 'react';
import { usePlayer, usePlayerStore } from '../../store/usePlayerStore';
import recipesData from "../../data/recipes.json";
import RecipeCard from './RecipeCard';
import { validateIngredients } from '../../utils/utils';
import RecipePop from './RecipePop';

const RenderCategory = ({ category }) => {
  const player = usePlayer();
  const recipesUnlocked = usePlayerStore((state) => state.recipesUnlocked);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const categoryRecipes = recipesUnlocked.filter((recipe) => recipesData[recipe].type === category.filterType);

  const handleSelectedRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  }

  const handleClose = () => { setSelectedRecipe(null) }

  return (
    <div>
      <ul className='mt-3 flex gap-5 flex-wrap lg:flex-none justify-center lg:justify-normal'>
        {
          categoryRecipes.map((recipe) => {
            const recipeData = recipesData[recipe];
            const canCraft = validateIngredients(player.inventory, recipeData.ingredients);
            return (
              <li onClick={() => handleSelectedRecipe(recipeData)} className={`relative flex flex-col justify-between p-3 max-w-max cursor-pointer transition-all group bg-neutral-800/50 border-2 ${canCraft ? "border-green-300" : "border-red-400"} rounded-md`} key={recipeData.id}>
                <RecipeCard recipeData={recipeData} />
              </li>
            )
          })
        }
        { categoryRecipes.length === 0 && (
          <div className='text-center flex w-full'>
            <p className='mx-auto text-2xl mt-5 font-bold'>No <span className='text-amber-300'>{category.name}</span> Recipes was found!</p>
          </div>
        )}
      </ul>
      {selectedRecipe && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2'>
          <RecipePop onClose={handleClose} recipeData={selectedRecipe} playerInventory={player.inventory}/>
        </div>
      )}
    </div>
  )
}

export default RenderCategory