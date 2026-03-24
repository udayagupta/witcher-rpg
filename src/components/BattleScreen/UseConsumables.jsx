// import { usePlayer } from '../../context/PlayerContext/PlayerContext'
import itemsData from "../../data/items.json";
import Icon from "../Icon";
import { usePlayer, usePlayerStore } from "../../store/usePlayerStore";

const UseConsumables = ({ applyOil }) => {
  // const { player, consumeHealthItem } = usePlayer();
  
  // Zustand state
  const player = usePlayer();
  const consumeHealthItem = usePlayerStore((state) => state.consumeHealthItem);

  const ConsumableSection = ({ title, inventoryItems, categoryKey, onItemClick }) => {
    return (
      <div className={`flex-1 p-2 bg-neutral-800 rounded-md ${categoryKey}`}>
        <h4 className="heading witcher-font text-md my-2 p-0">{title}</h4>
        <ul className="grid grid-cols-2 gap-2">
          {inventoryItems.map((item) => {
            const data = itemsData[categoryKey]?.[item.id];
            if (!data) return null; 

            return (
              <li 
                key={item.id} 
                onClick={() => onItemClick && item.qty > 0 ? onItemClick(data) : null}
                className={`relative bg-neutral-900 witcher-font rounded-md p-2 py-3 flex flex-col justify-center items-center border-2 border-transparent transition duration-200 text-center ${item.qty < 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-amber-300 hover:text-amber-300"}`}
              >
                <Icon id={item.id} type={item.type} size={35}/>
                
                <p className="text-sm leading-tight">{data.name || item.id}</p>
                
                <span className="pt-sans-font absolute top-2 right-2 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
                  {item.qty === -1 ? '∞' : `x${item.qty}`}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="use-consumables flex gap-3 rounded-md mt-5">
      <ConsumableSection 
        title="Oils" 
        inventoryItems={player.inventory.oils} 
        categoryKey="oils"
        onItemClick={(oilData) => applyOil(oilData.name, oilData.id)} 
      />
      
      <ConsumableSection 
        title="Potions" 
        inventoryItems={player.inventory.potions} 
        categoryKey="potions"
        onItemClick={(potionData) => consumeHealthItem(potionData.id, "potion")} 
      />
      
      <ConsumableSection 
        title="Foods" 
        inventoryItems={player.inventory.foods} 
        categoryKey="foods"
        onItemClick={(foodData) => consumeHealthItem(foodData.id, "food")}
      />
    </div>
  )
}

export default UseConsumables;