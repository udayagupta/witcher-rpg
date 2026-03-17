import { CiShop } from "react-icons/ci";
import { GiBlacksmith, GiLeatherArmor, GiBeerStein } from "react-icons/gi";
import shopsData from "../../data/shops.json";
import { motion } from "motion/react";

const ShopUI = ({shopId, close}) => {

  const currentShopData = shopsData[shopId];

  const iconClasses = "text-9xl text-amber-200/70 mb-4 mt-2 px-6";
  
  const iconMap = {
    "merchant": <CiShop className={iconClasses} />,
    "blacksmith": <GiBlacksmith className={iconClasses} />,
    "armorer": <GiLeatherArmor className={iconClasses} />,
    "innkeeper": <GiBeerStein className={iconClasses} /> 
  };

  return (
    <div  className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 '>
      
      <motion.div initial={{scaleX: 0, opacity: 0}} animate={{scaleX: 1, opacity: 1}} className="relative bg-neutral-900/95 flex w-[700px] h-[400px] py-2 px-5 border-2 rounded-lg   shadow-xl animate-fade-in">
          <div onClick={close} className="absolute close right-2 top-2 text-lg text-black cursor-pointer font-extrabold rounded-[50%] h-[30px] w-[30px] bg-amber-300">X</div>
          <div className="wares w-[70%]">
            <h4 className="witcher-font text-2xl">Wares</h4>
            <ul className="grid grid-cols-3 gap-5">
              {currentShopData.inventory.map((item) => (
                <li key={item.itemId} className="flex-1 rounded-md border text-xl">
                  <p>{item.itemId}</p>
                  <p>{item.quantity === -1 ? <span>&infin;</span> : item.quantity}</p>
                  <p>{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[30%] flex flex-col  items-center justify-center">
            {iconMap[currentShopData.type] || iconMap["merchant"]}
            <p className="playwrite-font text-xl">{currentShopData.name}</p>
            <p className="pt-sans-font text-xl mt-2">🪙 {currentShopData.gold}</p>
          </div>
      </motion.div>

    </div>
  )
}

export default ShopUI