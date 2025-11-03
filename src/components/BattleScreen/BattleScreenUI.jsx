import { useEffect, useRef } from "react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import HealthBar from "../PlayerProfile/HealthBar";
import MonsterHealth from "./MonsterHealth";
import { effectsData } from "../../utils/effects";

const BattleScreenUI = ({
  battleState,
  playerActions,
  monsterData,
  monsterId,
  exit
}) => {
  const { player } = usePlayer();

  useEffect(() => {
    const element = document.getElementById("battleLogs");
    if (element) {
      setTimeout(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  }, [battleState.battleLogs]);

  return (
    <div className="h-full">
      <div className="player-and-monster-f2f flex items-stretch gap-5">
        <div
          className={`player rounded-md flex-1 w-full p-2 transition duration-300 ${
            battleState.currentTurn === "player"
              ? "flashing-border-container"
              : "border border-transparent "
          } mx-3`}
        >
          <p className="witcher-font heading ">{player.name}</p>
          <HealthBar className="font-semibold" />
          <div className="stamina">
            
          </div>
          <ul
            className="currentEffects flex gap-2 mt-2"
            aria-label="Active debuffs on player"
          >
            {battleState.playerDebuffs.length === 0 && (
              <li className="text-sm w-full h-[56px] flex items-center justify-center p-2 opacity-60">No active effects</li>
            )}

            {battleState.playerDebuffs.map((debuff) => {
              const meta = effectsData[debuff.id] || {};
              return (
                <li
                  key={debuff.id}
                  title={`${meta.name || debuff.id} — ${
                    meta.description || ""
                  }`}
                  className="relative flex flex-col items-center"
                >
                  {/* Show emoji/icon if available, otherwise fall back to image */}

                  <img
                    src={`./images/${debuff.id}.png`}
                    className="h-[36px] w-[36px] object-contain"
                    alt={meta.name || debuff.id}
                  />

                  {/* Duration badge */}
                  {typeof debuff.duration === "number" && (
                    <span
                      className="absolute -right-1 -top-1 bg-neutral-900 text-xs px-1 rounded text-amber-200 border border-neutral-700"
                      aria-label={`Duration ${debuff.duration} turns`}
                    >
                      {debuff.duration}
                    </span>
                  )}

                  <div className="text-[10px] opacity-80 mt-1" aria-hidden>
                    {meta.name || debuff.id}
                  </div>
                </li>
              );
            })}
          </ul>
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

        <div className="battle-logs  bg-neutral-800 rounded-md flex-1 p-2 ">
          <h3 className="heading witcher-font">Battle Logs</h3>
          <ul
            id="battleLogs"
            className="overflow-auto py-1 flex flex-col gap-1 max-h-[450px]"
          >
            {battleState.battleLogs.map((log, index) => (
              <li
                className="border border-neutral-600 py-2 px-1 rounded-md mx-2"
                key={index}
              >
                {log}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`monster flex-1 rounded-md p-2 transition duration-300 ${
            battleState.currentTurn === "monster"
              ? "flashing-border-container"
              : "border border-transparent"
          } mx-3`}
        >
          <p className="witcher-font heading ">{monsterData.name}</p>
          <MonsterHealth
            current={monsterData.vitality}
            max={monsterData.max_vitality}
            className="mb-2 font-semibold"
          />
          <ul
            className="currentEffects flex gap-2 mt-2"
            aria-label="Active debuffs on monster"
          >
            {battleState.monsterDebuffs.length === 0 && (
              <li className="text-sm w-full h-[56px] flex items-center justify-center p-2 opacity-60">No active effects</li>
            )}

            {battleState.monsterDebuffs.map((debuff) => {
              const meta = effectsData[debuff.id] || {};
              return (
                <li
                  key={debuff.id}
                  title={`${meta.name || debuff.id} — ${
                    meta.description || ""
                  }`}
                  className="relative flex flex-col items-center"
                >
                  <img
                    src={`./images/${debuff.id}.png`}
                    className="h-[36px] w-[36px] object-contain"
                    alt={meta.name || debuff.id}
                  />
                  {typeof debuff.duration === "number" && (
                    <span
                      className="absolute -right-1 -top-1 bg-neutral-900 text-xs px-1 rounded text-amber-200 border border-neutral-700"
                      aria-label={`Duration ${debuff.duration} turns`}
                    >
                      {debuff.duration}
                    </span>
                  )}

                  <div className="text-[10px] opacity-80 mt-1" aria-hidden>
                    {meta.name || debuff.id}
                  </div>
                </li>
              );
            })}
          </ul>
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

      <div className="border rounded-md mt-3">
        <button onClick={exit} className="heading witcher-font w-full">
          Flee
        </button>
      </div>
    </div>
  );
};

export default BattleScreenUI;
