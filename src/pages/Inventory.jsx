import React, { useState } from 'react';
import { motion } from 'motion/react';
import RenderCategory from '../components/Inventory/RenderCategory';


const Inventory = () => {
  const [currentlyDisplaying, setCurrentlyDisplaying] = useState({ name: "Weapons", id: "weapons", toRender: ["silverSwords", "steelSwords"] });

  const categoryBtnClass = `text-amber-300 bg-neutral-800 cursor-pointer font-extrabold p-2 rounded-md flex-1 transition hover:bg-amber-300 hover:text-neutral-800`;
  const selectedBtnClass = `bg-amber-300 text-neutral-800 cursor-pointer font-extrabold p-2 rounded-md flex-1 transition`

  const handleCategory = (category) => { setCurrentlyDisplaying(category) };

  const categoryBtns = [
    { name: "Weapons", id: "weapons", toRender: ["steelSwords", "silverSwords"] },
    { name: "Equipments", id: "armor", toRender: ["armors", "gauntlets", "trousers", "boots"] },
    { name: "Potions", id: "potions", toRender: ["potions"] },
    { name: "Oils", id: "oils", toRender: ["oils"] },
    { name: "Resources", id: "resources", toRender: ["resources"] },
    { name: "Foods", id: "foods", toRender: ["foods"] },
  ]

  return (
    <motion.div className='h-full'>
      <h4 className='witcher-font text-3xl text-amber-300'>Inventory</h4>

      <div className='categories flex gap-4 mt-3'>
        {categoryBtns.map((btn) => (
          <button key={btn.id} className={currentlyDisplaying.id === btn.id ? selectedBtnClass : categoryBtnClass} onClick={() => handleCategory(btn)}>{btn.name}</button>
        ))}
      </div>

      <RenderCategory category={currentlyDisplaying}/>
    </motion.div>
  )
}

export default Inventory