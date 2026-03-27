import React, { useState } from 'react';
import { GiCrossedSwords, GiLeatherArmor, GiPotionBall, GiHerbsBundle } from "react-icons/gi";

const Icon = ({ id, type, size }) => {

  const  [imageError, setImageError] = useState(false);
  
  const iconClass = `m-auto my-2`

  const categoryIcon = {
    weapon: <GiCrossedSwords size={size} className={iconClass}/>,
    armor: <GiLeatherArmor size={size} className={iconClass}/>,
    potion: <GiPotionBall size={size} className={iconClass}/>,
    oil: <GiPotionBall size={size} className={iconClass}/>,
    resource: <GiHerbsBundle size={size} className={iconClass}/>,
    food: <GiHerbsBundle size={size} className={iconClass}/>
  }

  if (imageError) {
    return (
      <div>
        {categoryIcon[type]}
      </div>
    )
  }

  return (
    <img src={`./images/items/${id}.png`} style={{height: `${size}px`, width: `${size}px`}} className={`m-auto my-2 object-contain  `} alt="" onError={() => setImageError(true)}/>
  )
}

export default Icon