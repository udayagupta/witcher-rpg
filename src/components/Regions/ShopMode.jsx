import itemsData from "../../data/items.json";
import { updateShopInventory } from '../../utils/utils';
import Icon from '../Icon';
import { usePlayer, usePlayerStore } from '../../store/usePlayerStore';

const ShopMode = ({ mode, shopType, currentShopData }) => {

  // Zustand state
  const player = usePlayer();
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const addCoins = usePlayerStore((state) => state.addCoins);
  const spendCoins = usePlayerStore((state) => state.spendCoins);
  const addToInventory = usePlayerStore((state) => state.addToInventory);
  const consumeItem = usePlayerStore((state) => state.consumeItem);

  const playerInventoryKeys = {
    merchant: ["foods", "resources"],
    blacksmith: ["steelSwords", "silverSwords", "oils"],
    armorer: ["armors", "gauntlets", "trousers", "boots"],
  }

  const shopItemsToRender = mode === "buy" ? (currentShopData.inventory || []) : playerInventoryKeys[shopType].flatMap(key => { return player.inventory[key] || [] });

  const trade = (e, mode, itemData) => {
    e.stopPropagation();
    const price = Math.round(mode === "buy" ? itemData.price * currentShopData.pricing_multiplier : itemData.price)
    
    if (mode === "buy" && player.coins < price) return;
    if (mode === "sell" && currentShopData.gold < price) return;
    
    console.log(currentShopData.pricing_multiplier);

    const qtyChange = mode === "buy" ? -1 : +1; 

    if (mode === "buy") {
      spendCoins(price);
      addToInventory(itemData.id, 1, itemData.type);

      setPlayer((prev) => ({
        shops: {
          ...prev.shops,
          [currentShopData.merchant_id]: {
            ...currentShopData,
            gold: currentShopData.gold + price,
            inventory: updateShopInventory(currentShopData.inventory, itemData, qtyChange)
          }
        }
      }))

    } else {
      addCoins(price);
      // (itemData.id, itemData.type, 1);
      consumeItem(itemData, 1);

      setPlayer((prev) => ({
        shops: {
          ...prev.shops,
          [currentShopData.merchant_id]: {
            ...currentShopData,
            gold: currentShopData.gold - price,
            inventory: updateShopInventory(currentShopData.inventory, itemData, qtyChange)
          }
        }
      }))
    }
  }

  return (
    <ul className="flex flex-col lg:grid lg:grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar content-start">
      {shopItemsToRender.map((item) => {
        const itemData = itemsData[mode === "buy" ? item.category : item.type][item.id];
        if (!itemData) return null;

        const price = mode === "buy" ? item.price * currentShopData.pricing_multiplier : itemData.price;
        return (
          <li
            key={itemData.id}
            className="relative flex flex-col justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-md cursor-pointer hover:border-amber-500 hover:bg-neutral-800 transition-all group"
            role="button"
            onClick={(e) => trade(e, mode, itemData)}
          >
            <span className="absolute bottom-2 right-2 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
              {item.qty === -1 ? '∞' : `x${item.qty}`}
            </span>

            <p className="font-semibold text-neutral-200 text-lg pr-6 leading-tight truncate" title={itemData.name}>
              {itemData.name}
            </p>

            <div className="">
              <Icon id={itemData.id} type={itemData.type} size={50}/>
            </div>


            <div className="flex justify-between items-end mt-4">
              <p className="text-amber-400 font-bold text-md flex items-center gap-1">
                {Math.round(price)}
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