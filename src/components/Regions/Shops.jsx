import shopsData from "../../data/shops.json";
import { CiShop } from "react-icons/ci";
import { GiBlacksmith, GiLeatherArmor, GiBeerStein } from "react-icons/gi";
import  ShopUI  from "../Regions/ShopUI";
import { useState } from "react";
import { motion } from "motion/react";

const Shops = ({ subLocationData, shopType }) => {
  const shopData = shopsData[subLocationData[shopType]];
  const iconClasses = "text-6xl text-amber-200/70 mb-4 mt-2";
  
  const iconMap = {
    "merchant": <CiShop className={iconClasses} />,
    "blacksmith": <GiBlacksmith className={iconClasses} />,
    "armorer": <GiLeatherArmor className={iconClasses} />,
    "innkeeper": <GiBeerStein className={iconClasses} /> 
  };

  const [shopActive, setShopActive] = useState(false);
  const close = () => {setShopActive(prev => false)};

  return (
    subLocationData[shopType] && (
      <motion.div initial={{scale: 0, opacity: 0}} animate={{scale: 1, opacity: 1}} className='flex flex-col items-center p-3 w-56 bg-neutral-900/90 rounded-md border border-transparent  hover:border-amber-300 transition-colors'>
      
      <h4 className='text-lg capitalize witcher-font text-amber-300'>
        {shopType}
      </h4>

      {iconMap[shopType] || <CiShop className={iconClasses} />}

      <p className='text-md playwrite-font text-neutral-300 text-center mb-5 pt-sans-fonts min-h-[48px] flex items-center'>
        {shopData.name}
      </p>

      <button onClick={() => setShopActive(prev => !prev)} className='cursor-pointer w-full py-1.5 px-4 rounded font-bold text-neutral-900 bg-amber-300 hover:bg-amber-200 transition-colors'>
        Check Wares
      </button>
      
      {shopActive && <ShopUI shopId={shopData.merchant_id} close={close}/>}
    </motion.div>
    )
  )
}

export default Shops