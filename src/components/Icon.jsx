import React, { useState } from 'react';
import { GiCrossedSwords, GiLeatherArmor, GiPotionBall, GiHerbsBundle } from "react-icons/gi";

const Icon = ({ id, type, size }) => {

  const  [imageError, setImageError] = useState(false);
  
  const iconClass = `m-auto h-[${size}] w-[${size}] my-2`

  const categoryIcon = {
    weapon: <GiCrossedSwords className={iconClass}/>,
    armor: <GiLeatherArmor className={iconClass}/>,
    potion: <GiPotionBall className={iconClass}/>,
    oil: <GiPotionBall className={iconClass}/>,
    resource: <GiHerbsBundle className={iconClass}/>,
    food: <GiHerbsBundle className={iconClass}/>
  }

  if (imageError) {
    return (
      <div>
        {categoryIcon[type]}
      </div>
    )
  }

  return (
    <img src={`./images/items/${id}.png`} className={`m-auto my-2 h-[${size}] w-[${size}]`} alt="" onError={() => setImageError(true)}/>
  )
}

export default Icon