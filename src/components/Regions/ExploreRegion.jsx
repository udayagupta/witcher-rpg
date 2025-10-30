import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import locationsData from "../../data/locations.json";
import monsterData from "../../data/monster.json";
import { useState } from "react";
import BattleScreen from "../BattleScreen/BattleScreen";

const ExploreRegion = () => {
  const { player } = usePlayer();
  const subLocationData =
    locationsData[player.currentLocation]["sub_locations"][player.subLocation];

  const [gameMode, setGameMode] = useState("explore");
  const [selectedMonster, setSelectedMonster] = useState(null);

  const Explore = () => {
    return (
    <div>
      <h3 className="witcher-font text-3xl heading">{subLocationData.name}</h3>

      <div className="interactions flex flex-col gap-10 mt-5">
        <div className="gather-resources">
          <h4 className="text-amber-300 text-2xl witcher-font">
            Gather Resources
          </h4>
          {subLocationData["resources_to_gather"] ? (
            <ul className="items-list">
              {subLocationData["resources_to_gather"]?.map((item) => (
                <li
                  key={item}
                  className="items-list-item items-list-item-not-selected"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xl">
              No resources to gather, try going somewhere else.
            </p>
          )}
        </div>
        <div className="monster-hunting">
          <h4 className="text-amber-300 text-2xl witcher-font">
            Monster Hunting
          </h4>
          {subLocationData["monsters_found"] ? (
            <ul className="grid grid-cols-4 gap-4 p-2">
              {subLocationData["monsters_found"]?.map((monster) => (
                <li
                  key={monster}
                  className="items-list-item items-list-item-not-selected w-[193px] h-[254px] hover:text-amber-300"
                  onClick={() => {
                    setSelectedMonster(monster);
                    setGameMode("battle");
                  }}
                >
                  <p className="witcher-font font-semibold">
                    {monsterData[monster].name}
                  </p>
                  <img
                    src={`./images/${monster}.png`}
                    className="w-full object-contain "
                    alt=""
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xl">
              No mounsters to hunt, try going somewhere else.
            </p>
          )}
        </div>

        {subLocationData.blacksmith && (
          <div>
            <h4 className="text-2xl text-amber-300 witcher-font">
              {subLocationData.blacksmith.name}
            </h4>
          </div>
        )}

        {subLocationData.merchant && (
          <div>
            <h4 className="text-2xl text-amber-300 witcher-font">
              {subLocationData.blacksmith.name}
            </h4>
          </div>
        )}

        {subLocationData.armorer && (
          <div>
            <h4 className="text-2xl text-amber-300 witcher-font">
              {subLocationData.armorer.name}
            </h4>
          </div>
        )}
      </div>

      {}
    </div>
  );
  }

  return (
    gameMode === "explore" ? (
      <Explore />
    ) : (
      <BattleScreen monsterId={selectedMonster}/>
    )
  );
};

export default ExploreRegion;
