import HealthBar from "../PlayerProfile/HealthBar";
import StaminaBar from "../PlayerProfile/StaminaBar";
import MonsterHealth from "./MonsterHealth";
import UseConsumables from "./UseConsumables";
import ActiveEffects from "./ActiveEffects";
import BattleLogs from "./BattleLogs";
import { usePlayer } from "../../store/usePlayerStore";
import { useEffect } from "react";
import { slideToId } from "../../utils/utils";

const BattleScreenUI = ({
  battleState,
  playerActions,
  monsterData,
  monsterId,
  exit,
  applyOil
}) => {

  const player = usePlayer();
  const isDiscovered = player.discoveredMonsters.includes(monsterData.id);

  useEffect(() => {
    if (battleState.currentTurn === "player") slideToId("player-screen");
    if (battleState.currentTurn === "monster") slideToId("monster-screen");
  }, [battleState.currentTurn])

  return (
    <div className="h-full w-full overflow-x-hidden p-2 sm:p-4">

      <div className="player-and-monster-f2f flex flex-col lg:flex-row items-stretch gap-4 lg:gap-5">
        
        <div
          className={`player-screen bg-neutral-900 rounded-md flex-1 w-full p-4 transform transition-all duration-300 order-2 lg:order-1 ${
            battleState.currentTurn === "player"
              ? "flashing-border-container "
              : "border border-transparent"
          }`}
          id="player-screen"
        >
          <p className="witcher-font heading">{player.name}</p>
          <HealthBar className="font-semibold" vitality={player.vitality} maxVitality={player.maxVitality}/>
          <StaminaBar className="font-semibold mt-4" />
          <div className="stamina"></div>

          <ActiveEffects battleState={battleState} target={"player"}/>
          
          <ul className="player-actions my-4 grid grid-cols-2 lg:flex lg:flex-col gap-3">
            {playerActions.map((action) => (
              <li
                key={action.name}
                onClick={action.handler}
                className="p-3 text-center rounded-md border cursor-pointer transition witcher-font border-neutral-700 hover:text-amber-300 hover:border-amber-300 active:scale-95 bg-neutral-800/50"
              >
                {action.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-3 lg:order-2 flex-1 w-full min-h-[150px] lg:min-h-0">
          <BattleLogs battleState={battleState}/>
        </div>

        <div
          className={`monster-screen flex-1 w-full rounded-md p-4 flex flex-col transform transition-all duration-300 order-1 lg:order-3 ${
            battleState.currentTurn === "monster"
              ? "flashing-border-container -translate-x-2 lg:translate-x-0"
              : "border border-transparent translate-x-0"
          }`}
          id="monster-screen"
        >
          <p className="witcher-font heading text-center lg:text-left order-2 lg:order-1">
            {isDiscovered ? monsterData.name : "Unidentified Monster"}
          </p>

          <div className="order-3 lg:order-2 w-full">
            <MonsterHealth
              current={monsterData.vitality}
              max={monsterData.max_vitality}
              className="mb-2 font-semibold"
              defense={monsterData.defense}
            />
          </div>
          
          {/* EFFECTS: Order 4 on Mobile, Order 3 on Desktop */}
          <div className="order-4 lg:order-3 w-full">
            <ActiveEffects battleState={battleState} target={"monster"}/>
          </div>

          {/* IMAGE: Order 1 on Mobile (Top!), Order 4 on Desktop (Bottom!) */}
          <div className="relative mb-4 lg:mb-0 lg:mt-4 flex justify-center order-1 lg:order-4 w-full">
            <img
              src={`/images/${monsterId}.png`}
              alt="Monster"
              className="w-full max-h-[250px] lg:max-h-[400px] object-contain drop-shadow-2xl"
            />
            <div className="layer animations absolute inset-0 flex items-center justify-center z-50"></div>
          </div>
          
        </div>
      </div>
      
      {/* CONSUMABLES & FLEE */}
      <div className="mt-4 flex flex-col gap-3">
        <UseConsumables applyOil={applyOil}/>
        <div className="bg-neutral-900 rounded-md">
          <button onClick={exit} className="heading cursor-pointer witcher-font w-full py-3 hover:text-red-400 transition-colors">
            Flee
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default BattleScreenUI;