import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import itemsData from "../../data/items.json";

export const PlayerProfile = ({ className }) => {
  const { player, heal } = usePlayer();

  // Defensive helpers for possibly-missing fields
  const steelAtk = player?.attack?.steelAttack ? player.attack.steelAttack.join("-") : "—";
  const silverAtk = player?.attack?.silverAttack ? player.attack.silverAttack.join("-") : "—";
  const defense = player?.defense ?? "—";
  const crit_chance = player.crit_chance;

  const inventoryCount = (player.inventory || []).length;

  return (
    <section className={`${className} border border-amber-300 player-profile w-full p-4 font-semibold bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-neutral-900 font-bold text-xl">
            {player.name?.charAt(0) ?? "G"}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold witcher-font">{player.fullName}</h2>
              <p className="text-sm opacity-80">Level <strong className="text-amber-300">{player.level}</strong></p>
            </div>

            <div className="text-right">
              <p className="text-sm">💰 <span className="font-semibold">{player.coins}</span></p>
              <p className="text-xs opacity-70">Inv: {inventoryCount}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-xs mb-1 opacity-80">Vitality</div>
            <div className="w-full h-5 bg-neutral-700 rounded overflow-hidden border-2 border-red-700">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (player.vitality / player.maxVitality) * 100))}%` }}
              />
            </div>
            <div className="text-xs mt-1">{player.vitality} / {player.maxVitality}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div className="p-2 bg-neutral-900/30 rounded">
          <div className="opacity-80 text-xs">Attack (Steel)</div>
          <div className="font-semibold text-lg">{steelAtk} ⚔️</div>
        </div>

        <div className="p-2 bg-neutral-900/30 rounded">
          <div className="opacity-80 text-xs">Attack (Silver)</div>
          <div className="font-semibold text-lg">{silverAtk} ⚔️</div>
        </div>

        <div className="p-2 bg-neutral-900/30 rounded">
          <div className="opacity-80 text-xs">Defense</div>
          <div className="font-semibold text-lg">{defense} 🛡️</div>
        </div>

        <div className="p-2 bg-neutral-900/30 rounded">
          <div className="opacity-80 text-xs">Crit. Chance</div>
          <div className="font-semibold text-lg">{crit_chance}% 💥</div>
        </div>

        {/* <div className="p-2 bg-neutral-900/30 rounded">
          <div className="opacity-80 text-xs">Equipment</div>
          <div className="font-semibold">
            {Object.entries(player.equipment || {}).map(([slot, eq]) => (
              <div key={slot} className="text-xs opacity-90">{slot.replace('_', ' ')}: {eq ? eq : '—'}</div>
            ))}
          </div>
        </div> */}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 rounded text-neutral-900 font-bold"
          onClick={() => heal(100)}
        >
          Rest (+100 HP)
        </button>
      </div>
    </section>
  );
};
