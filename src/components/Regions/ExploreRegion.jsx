import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import locationsData from "../../data/locations.json";
import monsterData from "../../data/monster.json";
import { useState } from "react";
import BattleScreen from "../BattleScreen/BattleScreen";
import itemsData from "../../data/items.json";
import GatherResources from "./GatherResources";
import MonsterHunting from "./MonsterHunting";
import Shops from "./Shops";

const ExploreRegion = () => {
  const { player, setPlayer, heal, addToInventory } = usePlayer();
  const subLocationData = locationsData[player.currentLocation]["sub_locations"][player.subLocation];

  const [gameMode, setGameMode] = useState("explore");
  const [selectedMonster, setSelectedMonster] = useState(null);

  const exit = () => {
    setGameMode("explore");
    setPlayer((prev) => ({
      ...prev,
      inBattle: false
    }))
  }

  const changeGameMode = (mode) => { setGameMode(mode); }

  const Explore = () => {
    return (
    <div className="bg-neutral-800 h-full rounded-md overflow-auto">
      <h3 className="witcher-font text-3xl heading">{subLocationData.name}</h3>

      <div className="interactions flex flex-col gap-10 mt-5">
        <GatherResources subLocationData={subLocationData} itemsData={itemsData}/>
        <MonsterHunting props={{subLocationData, monsterData, setSelectedMonster, setGameMode, setPlayer}}/>
        <div className="shops px-5 pb-4">
          <h4 className="witcher-font text-2xl text-amber-300">Shops</h4>
          {(!subLocationData.merchant && !subLocationData.armorer && !subLocationData.blacksmith) && <p className="mt-2 text-xl">No Shops in this region</p>}
          <Shops subLocationData={subLocationData} shopType={"blacksmith"}/>
          <Shops subLocationData={subLocationData} shopType={"merchant"}/>
          <Shops subLocationData={subLocationData} shopType={"armorer"}/>
        </div>

        {subLocationData.canRest && (
          <button className="border w-max m-auto p-2 text-lg cursor-pointer rounded border-amber-300 witcher-font" onClick={() => heal(100)}>
            Rest <span className="pt-sans-font font-semibold text-red-500">+100</span> Vitality
          </button>
        )}
      </div>

    </div>
  );
  }

  return (
    gameMode === "explore" ? (
      <Explore />
    ) : (
      <BattleScreen handleGameMode={changeGameMode} exit={exit} monsterId={selectedMonster}/>
    )
  );
};

export default ExploreRegion;
