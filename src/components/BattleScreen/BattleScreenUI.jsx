import { useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import HealthBar from "../PlayerProfile/HealthBar";
import MonsterHealth from "./MonsterHealth";
import UseConsumables from "./UseConsumables";
import ActiveEffects from "./ActiveEffects";
import BattleLogs from "./BattleLogs";

const BattleScreenUI = ({
  battleState,
  playerActions,
  monsterData,
  monsterId,
  exit,
  applyOil
}) => {
  const { player } = usePlayer();

  return (
    <div className="h-full">
      <div className="player-and-monster-f2f flex items-stretch gap-5">
        <div
          className={`player-screen rounded-md flex-1 w-full p-2 transition duration-300 ${battleState.currentTurn === "player"
              ? "flashing-border-container"
              : "border border-transparent "
            } mx-3`}
        >
          <p className="witcher-font heading ">{player.name}</p>
          <HealthBar className="font-semibold" />
          <p>{player.stamina}</p>
          <div className="stamina"></div>

          <ActiveEffects battleState={battleState} target={"player"}/>
          
          <ul className="player-actions my-3 flex gap-4 flex-col">
            {playerActions.map((action) => (
              <li
                key={action.name}
                onClick={action.handler}
                className={`p-2 rounded-md flex-1 border cursor-pointer transition witcher-font border-neutral-700 hover:text-amber-300 hover:border-amber-300`}
              >
                {action.name}
              </li>
            ))}
          </ul>
        </div>

        <BattleLogs battleState={battleState}/>

        <div
          className={`monster-screen flex-1 rounded-md p-2 transition duration-300 ${battleState.currentTurn === "monster"
              ? "flashing-border-container"
              : "border border-transparent"
            } mx-3`}
        >
          <p className="witcher-font heading ">{monsterData.name}</p>
          <MonsterHealth
            current={monsterData.vitality}
            max={monsterData.max_vitality}
            className="mb-2 font-semibold"
            defense={monsterData.defense}
          />
          <ActiveEffects battleState={battleState} target={"monser"}/>
          <div className="relative">
            <img
              src={`./images/${monsterId}.png`}
              alt=""
              className="w-full object-contain"
            />
            <div className="layer animations absolute inset-0 flex items-center justify-center z-50"></div>
          </div>
        </div>
      </div>
      
      <UseConsumables applyOil={applyOil}/>
      <div className="border rounded-md mt-3">
        <button onClick={exit} className="heading witcher-font w-full">
          Flee
        </button>
      </div>
    </div>
  );
};

export default BattleScreenUI;
