import { useState } from 'react'
import { usePlayer } from '../../context/PlayerContext/PlayerContext';
import itemsData from "../../data/items.json";
import { motion } from 'motion/react';
import { GiCrossedSwords, GiLeatherArmor, GiPotionBall, GiHerbsBundle } from "react-icons/gi";
import { canBeEquipped } from '../../utils/utils';


const RenderCategory = ({ category }) => {
  const { player, heal, equip } = usePlayer();

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

  const onClose = () => {
    setSelectedItem(null);
  }

  const onEquip = (itemData) => {

    if (!equip(itemData)) return;

    return (
      <p className='absolute bg-neutral-900 border border-neutral-700 top-10 p-4 rounded-md text-3xl'>{selectedItem.name} Equipped!</p>
    )
  }

  const levelReq = !(selectedItem?.level_req <= player.level);

  return (
    <div className='flex gap-5 mt-5'>
      <motion.ul className='flex-2 gap-3 grid grid-cols-5'>
        {
          items.map((item) => {
            const itemData = itemsData[item.type][item.id];
            return (
              <li onClick={() => handleSelectedItem(itemData)} className='relative h-[100px] flex flex-col justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-md cursor-pointer hover:border-amber-500 hover:bg-neutral-800 transition-all group' key={item.id}>
                <span className="absolute bottom-2 right-2 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
                  {item.qty === -1 ? '∞' : `x${item.qty}`}
                </span>
                <p>{itemData.name}</p>
              </li>
            )
          })
        }
      </motion.ul>
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className='relative bg-neutral-900 border border-neutral-700 flex flex-col w-[650px] min-h-[350px] p-8 rounded-lg shadow-2xl text-white'>

            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors font-bold text-lg"
              title="Close Details"
            >
              ✕
            </button>

            <div className="flex justify-between items-start mb-2 border-b border-neutral-800 pb-4 pr-8">
              <h2 className="text-3xl text-amber-400 witcher-font tracking-wide">
                {selectedItem.name}
              </h2>
              <div className="flex items-center gap-2 bg-neutral-950 px-4 py-2 rounded-full border border-neutral-800">
                <span className="text-lg">🪙</span>
                <p className="font-bold text-amber-400 text-lg">{selectedItem.price}</p>
              </div>
            </div>

            <div className='flex justify-between text-sm text-neutral-400 uppercase tracking-widest font-bold mb-6'>
              <div>
                <p>
                  <span className={
                    selectedItem.rarity === 'rare' ? 'text-purple-400' :
                      selectedItem.rarity === 'uncommon' ? 'text-blue-400' :
                        selectedItem.rarity === "legendary" ? "text-orange-400" :
                          'text-neutral-300'
                  }>
                    {selectedItem.rarity}
                  </span>
                  <span className="mx-2">•</span>
                  {selectedItem.type}
                </p>
              </div>
              <div>
                  {selectedItem.type === "weapon" || selectedItem.type === "armor" ? (
                    <p>Level Requirement: {selectedItem.level_req} ({levelReq ? "❎" : "✅"})</p>
                  ) : 
                    <p>No Requirements</p>
                  }
              </div>
            </div>

            <p className="text-xl text-neutral-300 italic mb-8 leading-relaxed">
              "{selectedItem.description}"
            </p>

            <div className="text-lg mt-auto bg-neutral-950/60 p-3 rounded-lg border border-neutral-800 flex items-center justify-center">
              {
                selectedItem.type === "weapon" ? (
                  <div>
                    <p className=" font-bold text-red-400 tracking-wider">
                      ⚔️ Attack: {selectedItem.attack[0]} - {selectedItem.attack[1]}
                    </p>
                  </div>
                ) : selectedItem.type === "armor" ? (
                  <p className="font-bold text-blue-400 tracking-wider">
                    🛡️ Defense: {selectedItem.defense}
                  </p>
                ) : selectedItem.type === "potion" || selectedItem.type === "food" ? (
                  <p className="font-bold text-green-400 tracking-wider">
                    ❤️ Heal: +{selectedItem.heal} Vitality
                  </p>
                ) : selectedItem.type === "oil" ? (
                  <p className="font-bold text-purple-400 tracking-wider">
                    🧪 Blade Coating (Combat Buff)
                  </p>
                ) : selectedItem.type === "material" ? (
                  <p className="font-bold text-amber-600/80 tracking-wider">
                    🛠️ Crafting & Alchemy Component
                  </p>
                ) : (
                  <p className="text-xl text-neutral-500 tracking-wider">Miscellaneous Item</p>
                )
              }
            </div>
            {
              (selectedItem.type === "armor" || selectedItem.type === "weapon") && (
                // <button onClick={() => onEquip(selectedItem)} className='bg-amber-300 cursor-pointer mt-4 rounded-md p-2 text-neutral-950 font-extrabold text-lg'>{checkIfEquipped(player.equipment, selectedItem) ? "Equipped" : "Equip"}</button>
                <button onClick={() => onEquip(selectedItem)} className='bg-amber-300 cursor-pointer mt-4 rounded-md p-2 text-neutral-950 font-extrabold text-lg'>{canBeEquipped(player.level, player.equipment, selectedItem)}</button>
              )
            }
            {
              (selectedItem.type === "potion" || selectedItem.type === "food") && (
                <button onClick={() => heal(selectedItem.heal)} className='bg-amber-300 cursor-pointer mt-4 rounded-md p-2 text-neutral-950 font-extrabold text-lg'>{player.vitality === player.maxVitality ? "Already Full" : "Consume"}</button>
              )
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default RenderCategory