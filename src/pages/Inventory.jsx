import React from 'react';
import itemsData from "../data/items.json";
import { usePlayer } from "../context/PlayerContext/PlayerContext"


const Inventory = () => {
  const { player } = usePlayer();
  return (
    <div>
      this is inv
    </div>
  )
}

export default Inventory