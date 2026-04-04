import { useState } from 'react'
import itemsData from "../../data/items.json";
import { motion } from 'motion/react';
import { canBeEquipped } from '../../utils/utils';
import Icon from '../Icon';
import { usePlayerStore, usePlayer } from '../../store/usePlayerStore';
import ItemCard from './ItemCard';

const RenderCategory = ({ category }) => {

  const player = usePlayer();
  const equip = usePlayerStore((state) => state.equip);
  const consumeHealthItem = usePlayerStore((state) => state.consumeHealthItem);

  const items = category.toRender.flatMap((inventoryKey) => {
    return player.inventory[inventoryKey] || [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectedItem = (item) => {
    setSelectedItem(item);
  }

  const onClose = () => {
    setSelectedItem(null);
  }

  const onEquip = (itemData) => {
    if (!equip(itemData)) return;
    
  }

  const handleDrink = () => {
    consumeHealthItem(selectedItem.id, selectedItem.type);
    onClose();
  }

  const levelReq = !(selectedItem?.level_req <= player.level);

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const itemData = itemsData[item.type][item.id];
    return (
      itemData.name.toLowerCase().includes(query) ||
      itemData.id.toLowerCase().includes(query) ||
      itemData.type.toLowerCase().includes(query) ||
      itemData.rarity.toLowerCase().includes(query)
    )
  })

  return (
    <div className='flex gap-5 flex-col mt-5'>
      <div className="w-max">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" name="" id="" placeholder="Search..." className="py-2 px-5 font-semibold tracking-wide border rounded-md border-neutral-700 active:outline-none active:border-amber-300 focus:outline-none focus:border-amber-300" />
      </div>
      <motion.ul
        className={`w-full ${items.length === 0
          ? "flex justify-center"
          : "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center sm:justify-items-stretch"
          }`}
      >
        {items.length === 0 && (
          <li className='text-2xl mt-8 text-center'>
            No Items with <span className='text-amber-300'>{category.name}</span> category
          </li>
        )}
        {
          filteredItems.map((item) => {
            const itemData = itemsData[item.type][item.id];
            return (
              <li
                key={item.id}
                onClick={() => handleSelectedItem(itemData)}
                className="relative w-full max-w-[320px] sm:max-w-none min-h-[140px] flex flex-col justify-between p-3 card cursor-pointer hover:border-amber-300 transition-all group bg-neutral-800/50 border border-neutral-700 rounded-md"
              >
                <ItemCard itemData={itemData} item={item} />
              </li>
            )
          })
        }
      </motion.ul>
      {selectedItem && (
        <div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            className='relative bg-neutral-900 border border-neutral-700 flex flex-col w-full max-w-[650px] max-h-[90vh] overflow-y-auto min-h-[350px] p-5 sm:p-8 rounded-lg shadow-2xl text-white'
          >

            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors font-bold text-lg"
              title="Close Details"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 sm:gap-0 mb-4 sm:mb-2 border-b border-neutral-800 pb-4 pr-12 sm:pr-8">
              <h2 className="text-2xl sm:text-3xl text-amber-400 witcher-font tracking-wide break-words">
                {selectedItem.name}
              </h2>
              <div className="flex items-center gap-2 bg-neutral-950 px-4 py-2 rounded-full border border-neutral-800 self-start sm:self-auto">
                <span className="text-lg">🪙</span>
                <p className="font-bold text-amber-400 text-lg">{selectedItem.price}</p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-bold mb-6'>
              <div >
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
                  <p>Level Req: {selectedItem.level_req} ({levelReq ? "❎" : "✅"})</p>
                ) :
                  <p>No Requirements</p>
                }
              </div>
            </div>

            <div className="flex justify-center sm:justify-start">
              <Icon id={selectedItem.id} type={selectedItem.type} size={80} />
            </div>

            <p className="text-lg sm:text-xl text-neutral-300 italic mb-8 mt-4 leading-relaxed text-center sm:text-left">
              "{selectedItem.description}"
            </p>

            <div className="text-base sm:text-lg mt-auto bg-neutral-950/60 p-3 rounded-lg border border-neutral-800 flex items-center justify-center text-center">
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
                ) : selectedItem.type === "resource" ? (
                  <p className="font-bold text-amber-600/80 tracking-wider">
                    🛠️ Crafting & Alchemy Component
                  </p>
                ) : (
                  <p className="text-base sm:text-xl text-neutral-500 tracking-wider">Miscellaneous Item</p>
                )
              }
            </div>
            {
              (selectedItem.type === "armor" || selectedItem.type === "weapon") && (
                <button onClick={() => onEquip(selectedItem)} className='bg-amber-300 cursor-pointer mt-4 rounded-md p-2 text-neutral-950 font-extrabold text-base sm:text-lg transition-transform active:scale-95 hover:bg-amber-400'>
                  {canBeEquipped(player.level, player.equipment, selectedItem)}
                </button>
              )
            }
            {
              (selectedItem.type === "potion" || selectedItem.type === "food") && (
                <button onClick={() => handleDrink()} className='bg-amber-300 cursor-pointer mt-4 rounded-md p-2 text-neutral-950 font-extrabold text-base sm:text-lg transition-transform active:scale-95 hover:bg-amber-400'>
                  {player.vitality === player.maxVitality ? "Already Full" : "Consume"}
                </button>
              )
            }
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default RenderCategory