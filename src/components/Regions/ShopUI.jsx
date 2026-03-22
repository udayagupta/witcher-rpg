import { CiShop } from "react-icons/ci";
import { GiBlacksmith, GiLeatherArmor, GiBeerStein } from "react-icons/gi";
import shopsData from "../../data/shops.json";
import { motion } from "motion/react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { useState } from "react";

const ShopUI = ({ shopId, close }) => {
  const [currentShopData, setCurrentShopData] = useState(shopsData[shopId]);
  const { player, addToInventory, spendCoins } = usePlayer();

  const iconClasses = "text-9xl text-amber-200/70 mb-4 mt-2 px-6";
  const [shopMode, setShopMode] = useState("buy");

  const iconMap = {
    "merchant": <CiShop className={iconClasses} />,
    "blacksmith": <GiBlacksmith className={iconClasses} />,
    "armorer": <GiLeatherArmor className={iconClasses} />,
    "innkeeper": <GiBeerStein className={iconClasses} />
  };

  const buy = (e, data, price) => {
    e.stopPropagation();

    if (player.coins < price) return;

    spendCoins(price);
    addToInventory(data.itemId, 1, data.category);

    setCurrentShopData((prev) => {
      const updatedInventory = (prev.inventory || [])
        .map((item) => {
          if (item.itemId === data.itemId) {
            if (item.quantity === -1) return item;
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity === -1 || item.quantity > 0);

      return {
        ...prev,
        gold: prev.gold + price,
        inventory: updatedInventory
      };
    });
  }

  const formatName = (str) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleShopMode = (mode) => {
    if (shopMode === mode) return;
    setShopMode(mode);
  };

  return (
    <div  className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        className="relative bg-neutral-900 card flex w-[750px] h-[450px] p-6 rounded-lg shadow-2xl text-white"
      >
        <button
          onClick={close}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full h-[32px] w-[32px] flex items-center justify-center font-bold transition-colors"
        >
          ✕
        </button>

        {/* Left Panel: Wares */}
        <div className="flex flex-col w-[65%] pr-4 border-r border-neutral-800">
          <h4 className="witcher-font text-3xl text-amber-400 mb-4 tracking-wider">Wares</h4>

          <div className="flex gap-5 font-extrabold justify-center mb-4">
            <button onClick={() => handleShopMode("buy")} className={`p-1 px-8 cursor-pointer rounded-md ${shopMode === "buy" ? "bg-amber-300 text-neutral-800" : "bg-neutral-800"}`}>Buy</button>
            <button onClick={() => handleShopMode("sell")} className={`p-1 px-8 cursor-pointer rounded-md ${shopMode === "sell" ? "bg-amber-300 text-neutral-800" : "bg-neutral-800"}`}>Sell</button>
          </div>

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
        </div>

        {/* Right Panel: Merchant Info */}
        <div className="w-[35%] flex flex-col items-center justify-center pl-4">
          {iconMap[currentShopData.type] || iconMap["merchant"]}
          <p className="font-semibold text-2xl text-center text-neutral-200 mb-2">{currentShopData.name}</p>

          <div className="flex items-center gap-2 bg-neutral-950 px-4 py-2 rounded-full border border-neutral-800">
            <span className="text-xl">🪙</span>
            <p className="font-bold text-amber-400 text-lg">{currentShopData.gold}</p>
          </div>
          <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest">Merchant Funds</p>
        </div>

      </motion.div>
    </div>
  )
}

export default ShopUI