import { CiShop } from "react-icons/ci";
import { GiBlacksmith, GiLeatherArmor, GiBeerStein } from "react-icons/gi";
import shopsData from "../../data/shops.json";
import { motion } from "motion/react";
// import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { useState } from "react";
import ShopMode from "./ShopMode";
import { usePlayer } from "../../store/usePlayerStore";

const ShopUI = ({ shopId, close }) => {
  
  // zustand state
  const player = usePlayer();

  const currentShopData = player.shops[shopId] || shopsData[shopId];
  const iconClasses = "text-9xl text-amber-200/70 mb-4 mt-2 px-6";
  const [shopMode, setShopMode] = useState("buy");

  const iconMap = {
    "merchant": <CiShop className={iconClasses} />,
    "blacksmith": <GiBlacksmith className={iconClasses} />,
    "armorer": <GiLeatherArmor className={iconClasses} />,
    "innkeeper": <GiBeerStein className={iconClasses} />
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

          <ShopMode mode={shopMode} shopType={currentShopData.type} currentShopData={currentShopData} />

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