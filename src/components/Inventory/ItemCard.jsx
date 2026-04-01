import React from 'react';
import Icon from '../Icon';

const ItemCard = ({ itemData, item }) => {
  return (
    <div>
      {/* Quantity Badge */}
      <span className="absolute top-2 right-2 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 z-10">
        {item.qty === -1 ? '∞' : `x${item.qty}`}
      </span>

      {/* Icon & Name Section */}
      <div className="flex flex-col items-center mt-1">
        <Icon id={itemData.id} type={itemData.type} size={itemData.type === "armor" ? 80 : 50} />
        <p className="mt-2 text-sm font-semibold text-neutral-200 text-center leading-tight truncate w-full" title={itemData.name}>
          {itemData.name}
        </p>
        {/* Subtle Item Category Label */}
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
          {itemData.type.replace(/([A-Z])/g, ' $1').trim()} {/* Formats 'silverSwords' to 'silver Swords' */}
        </p>
      </div>

      {/* Dynamic Stats & Price Row */}
      <div className="flex justify-between items-end mt-3 w-full text-sm border-t border-neutral-700/50 pt-2">

        {/* Stat Container */}
        <div className="font-bold flex items-center gap-1">
          {(itemData.type === "weapon") && (
            <span className="text-red-400" title="Attack Damage">⚔️ {itemData.attack[0]}-{itemData.attack[1]}</span>
          )}

          {(itemData.type === "armor") && (
            <span className="text-blue-400" title="Armor Defense">🛡️ {itemData.defense}</span>
          )}

          {(itemData.type === "food" || itemData.type === "potion") && (
            <span className="text-green-400" title="Healing Amount">❤️ +{itemData.heal || itemData.vitality_regen}</span>
          )}

          {(itemData.type === "resource" || itemData.type === "oil") && (
            <span className="text-neutral-500 font-normal italic">Ingredient</span>
          )}
        </div>

        {/* Universal Price */}
        <span className="text-amber-400 font-bold flex items-center gap-1" title="Value">
          {itemData.price} <span className="text-[10px]">🪙</span>
        </span>

      </div></div>
  )
}

export default ItemCard