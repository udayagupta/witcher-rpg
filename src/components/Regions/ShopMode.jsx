import React from 'react';
import shopsData from "../../data/shops.json";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const ShopMode = ({ mode, shopId, shopType }) => {
  const { player, addToInventory, spendCoins } = usePlayer();
   

  return (
    <ul className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar content-start">
      {currentShopData.inventory.map((item) => {
        const price = Math.round(item.price * currentShopData.pricing_multiplier)
        return (
          <li
            key={item.itemId}
            className="relative flex flex-col justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-md cursor-pointer hover:border-amber-500 hover:bg-neutral-800 transition-all group"
            role="button"
            onClick={(e) => buy(e, item, price)}
          >
            <span className="absolute bottom-2 right-2 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
              {item.quantity === -1 ? '∞' : `x${item.quantity}`}
            </span>

            <p className="font-semibold text-neutral-200 text-lg pr-6 leading-tight truncate" title={formatName(item.itemId)}>
              {formatName(item.itemId)}
            </p>

            <div className="">
              <img
                src={`./images/items/${item.itemId}.png`}
                alt={item.itemId}
                className="w-[50px] m-auto my-2 h-[50px] object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>


            <div className="flex justify-between items-end mt-4">
              <p className="text-amber-400 font-bold text-md flex items-center gap-1">
                {price}
                <span className="text-[14px]">🪙</span>
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default ShopMode