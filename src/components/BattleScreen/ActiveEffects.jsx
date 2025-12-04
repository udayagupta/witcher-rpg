import itemsData from "../../data/items.json";
import { effectsData } from "../../utils/effects";

const ActiveEffects = ({ target, battleState }) => {
  const activeEffects = target === "player" ? battleState.playerDebuffs : battleState.monsterDebuffs;

  return (
    <ul
      className="currentEffects flex gap-2 mt-2"
      aria-label={`Active debuffs on ${target === "player" ? "player" : "monster"}`}
    >
      {(activeEffects.length === 0 && !battleState.appliedOil) && (
        <li className="text-sm w-full h-[56px] flex items-center justify-center p-2 opacity-60">
          No active effects
        </li>
      )}

      {(battleState.appliedOil && target === "player") && (
        <li
          key={battleState.appliedOil.name}
          title={`${battleState.appliedOil.name} is applied for ${battleState.appliedOil.duration} turns`}
          className="relative flex flex-col items-center"
        >
          <img
            src={`./images/oils/${itemsData["oils"][battleState.appliedOil.id]["img"]}.png`}
            className="h-[36px] w-[36px] object-contain"
            alt={battleState.appliedOil.name || battleState.appliedOil.id}
          />
          <span
            className="absolute -right-1 -top-1 bg-neutral-900 text-xs px-1 rounded text-amber-200 border border-neutral-700"
            aria-label={`Duration ${battleState.appliedOil.duration} turns`}
          >
            {battleState.appliedOil.duration}
          </span>
          <div className="text-[10px] opacity-80 mt-1" aria-hidden>
            {battleState.appliedOil.name}
          </div>
        </li>
      )}

      {activeEffects.map((debuff) => {
        const meta = effectsData[debuff.id] || {};
        return (
          <li
            key={debuff.id}
            title={`${meta.name || debuff.id} — ${meta.description || ""
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
  )
}

export default ActiveEffects