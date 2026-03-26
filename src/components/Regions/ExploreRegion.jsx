// import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import locationsData from "../../data/locations.json";
import monsterData from "../../data/monster.json";
import { useState } from "react";
import BattleScreen from "../BattleScreen/BattleScreen";
import itemsData from "../../data/items.json";
import GatherResources from "./GatherResources";
import MonsterHunting from "./MonsterHunting";
import Shops from "./Shops";
import { usePlayer, usePlayerStore } from "../../store/usePlayerStore";

const ExploreRegion = () => {
  // const { player, setPlayer, heal } = usePlayer();
  const player = usePlayer();
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const heal = usePlayerStore((state) => state.heal);
  const resetVitality = usePlayerStore((state) => state.resetVitality);
  
  const subLocationData = locationsData[player.currentLocation]["sub_locations"][player.subLocation];

  const [gameMode, setGameMode] = useState("explore");
  const [selectedMonster, setSelectedMonster] = useState(null);

  const exit = () => {
    setGameMode("explore");
    setPlayer((prev) => ({
      ...prev,
      inBattle: false
    }));
  };

  const changeGameMode = (mode) => { setGameMode(mode); };

  if (gameMode !== "explore") {
    return <BattleScreen handleGameMode={changeGameMode} exit={exit} monsterId={selectedMonster} />;
  }

  return (
    <div className="h-full rounded-md overflow-auto">
      <div className="interactions flex flex-col gap-10 mt-5">
        
        {subLocationData.canRest && (
          <button
            className="border flex flex-col items-center w-max m-auto px-6 py-3 card cursor-pointer rounded hover:border-amber-300 transition"
            onClick={() => {
              resetVitality();
            }}
          >
            <span className="text-2xl witcher-font text-amber-300 tracking-wider">Meditate</span>
            <div className="flex gap-4 mt-2 text-sm pt-sans-font font-semibold">
              <span className="text-red-300">❤️ Restores Vitality</span>
              <span className="text-amber-300">🪙 Restocks Merchants</span>
            </div>
          </button>
        )}

        <GatherResources subLocationData={subLocationData} itemsData={itemsData} />
        <MonsterHunting props={{ subLocationData, monsterData, setSelectedMonster, setGameMode, setPlayer }} />
        
        <div className="shops px-5 pb-4">
          <h4 className="witcher-font text-2xl text-amber-300">Shops</h4>
          {(!subLocationData.merchant && !subLocationData.armorer && !subLocationData.blacksmith) && (
            <p className="mt-2 text-xl">No Shops in this region</p>
          )}
          
          <Shops subLocationData={subLocationData} shopType={"blacksmith"} />
          <Shops subLocationData={subLocationData} shopType={"merchant"} />
          <Shops subLocationData={subLocationData} shopType={"armorer"} />
        </div>

      </div>
    </div>
  );
};

export default ExploreRegion;