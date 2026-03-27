import React, { useState } from 'react'
import { usePlayer, usePlayerStore } from "../../store/usePlayerStore";
import recipesData from "../../data/recipes.json";
import RenderCategory from './RenderCategory';

const CraftingAlchemy = () => {
  const player = usePlayer();

  const [currentlyDisplaying, setCurrentlyDisplaying] = useState({ name: "Weapons", filterType: "weapon" });

  const categoryBtnClass = `text-amber-300 bg-neutral-800 cursor-pointer font-extrabold p-2 rounded-md flex-1 transition hover:bg-amber-300 hover:text-neutral-800`;
  const selectedBtnClass = `bg-amber-300 text-neutral-800 cursor-pointer font-extrabold p-2 rounded-md flex-1 transition`

  const categoryBtns = [
    { name: "Weapons", filterType: "weapon" },
    { name: "Armor", filterType: "armor" },
    { name: "Potions", filterType: "potion" },
    { name: "Oils", filterType: "oil" },
    { name: "Components", filterType: "resource" }
  ];

  const handleCategory = (category) => { setCurrentlyDisplaying(category) };


  return (
    <div>
      <h4 className='witcher-font text-3xl text-amber-300'>Crafting & Alchemy</h4>

      <div className='categories flex gap-4 mt-3'>
        {categoryBtns.map((btn) => (
          <button key={btn.filterType} className={currentlyDisplaying.filterType === btn.filterType ? selectedBtnClass : categoryBtnClass} onClick={() => handleCategory(btn)}>{btn.name}</button>
        ))}
      </div>

      <RenderCategory category={currentlyDisplaying}/>
    </div>
  )
}

export default CraftingAlchemy