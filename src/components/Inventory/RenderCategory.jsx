import { useState } from 'react'
import { usePlayer } from '../../context/PlayerContext/PlayerContext';
import itemsData from "../../data/items.json";
import { motion } from 'motion/react';
import { GiCrossedSwords, GiLeatherArmor, GiPotionBall, GiHerbsBundle } from "react-icons/gi";


const RenderCategory = ({ category }) => {
  const { player } = usePlayer();

  const items = category.toRender.flatMap((inventoryKey) => {
    return player.inventory[inventoryKey] || [];
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const categoryIcon = {
    weapons: <GiCrossedSwords />,
    armor: <GiLeatherArmor />,
    potions: <GiPotionBall />,
    resources: <GiHerbsBundle />,
  }

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
  }

  return (
    <div className='flex gap-5 mt-5'>
      <motion.ul className='flex-2 gap-3 border grid grid-cols-3'>
        {
          items.map((item) => {
            const itemData = itemsData[item.type][item.id];
            return (
              <li onClick={() => handleSelectedItem(itemData)} className='relative flex flex-col justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-md cursor-pointer hover:border-amber-500 hover:bg-neutral-800 transition-all group' key={item.id}>
                <span className="absolute bottom-2 right-2 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
                  {item.qty === -1 ? '∞' : `x${item.qty}`}
                </span>
                <p>{itemData.name}</p>
              </li>
            )
          })
        }
      </motion.ul>
      <div className="details-panel flex-1 border">
        {!selectedItem && <p>No Item Selected</p>}
        {selectedItem && (
          <div>
            <p>{selectedItem.name}</p>
            <p>{selectedItem.description}</p>
            {
              selectedItem.type === "weapon" ? (
                <p>Attack: {selectedItem.attack[0]}-{selectedItem.attack[1]}</p>
              ) : selectedItem.type === "armor" ? (
                <p>Defense: {selectedItem.defense}</p>
              ) : selectedItem.type === "potion" || selectedItem.type === "food" ? (
                <p>Heal: {selectedItem.heal} Vitality</p>
              ) : <p></p>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default RenderCategory