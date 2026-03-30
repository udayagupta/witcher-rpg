import { formatNumber } from "../../utils/utils";
import itemsData from "../../data/items.json";
import HealthBar from "./HealthBar";
import { usePlayer } from "../../store/usePlayerStore";

export const PlayerProfile = ({ className }) => {

  const player = usePlayer();

  const steelAtk = player?.attack?.steelAttack ? player.attack.steelAttack.join("-") : "—";
  const silverAtk = player?.attack?.silverAttack ? player.attack.silverAttack.join("-") : "—";
  const defense = player?.defense ?? "—";
  
  const silverSwordEquipped = player.equipment?.silver_sword ? itemsData["silverSwords"][player.equipment.silver_sword] : { name: "None" };
  const steelSwordEquipped = player.equipment?.steel_sword ? itemsData["steelSwords"][player.equipment.steel_sword] : { name: "None" };

  const crit_chance = player.crit_chance || 0;
  const formattedPlayerCoins = formatNumber(player.coins || 0);

  const currentXp = player.currentExp;
  const maxXp = player.expToNextLevel;
  const xpPercentage = Math.min((currentXp / maxXp) * 100, 100);

  return (
    <section className={`${className} border card player-profile w-full p-4 font-semibold bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-neutral-900 font-bold text-xl shadow-inner">
            {player.name?.charAt(0) ?? "G"}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            
            <div className="w-full">
              <h2 className="text-2xl font-extrabold witcher-font tracking-wide">{player.fullName}</h2>
              
              <div className="flex justify-between items-end mt-1">
                <div className="w-1/2">
                  <p className="opacity-90 text-sm mb-1">
                    Level <strong className="text-amber-400 text-lg">{player.level}</strong>
                  </p>
                  {/* Level Progress Bar */}
                  <div 
                    className="w-full h-1.5 bg-neutral-600 rounded-full overflow-hidden shadow-inner" 
                    title={`${currentXp} / ${maxXp} XP`}
                  >
                    <div 
                      className="h-full bg-amber-300 rounded-full transition-all duration-300" 
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-lg">🪙 <span className="font-semibold">{formattedPlayerCoins}</span></p>
              </div>
            </div>

          </div>

          <div className="mt-4 space-y-2">
            <HealthBar vitality={player.vitality} maxVitality={player.maxVitality}/>
          </div>

        </div>
      </div>

      {/* Stats Grid */}
      <div className="lg:grid lg:grid-cols-2 flex flex-col  gap-2 mt-5 text-sm">
        <div className="p-2 bg-neutral-900/40 rounded border border-neutral-700/50" title="Steel Sword Damage">
          <div className="opacity-70 text-xs uppercase tracking-wider">{steelSwordEquipped.name}</div>
          <div className="font-semibold text-lg text-gray-300">{steelAtk} ⚔️</div>
        </div>

        <div className="p-2 bg-neutral-900/40 rounded border border-neutral-700/50" title="Silver Sword Damage">
          <div className="opacity-70 text-xs uppercase tracking-wider">{silverSwordEquipped.name}</div>
          <div className="font-semibold text-lg text-slate-300">{silverAtk} 🗡️</div>
        </div>

        <div className="p-2 bg-neutral-900/40 rounded border border-neutral-700/50">
          <div className="opacity-70 text-xs uppercase tracking-wider">Defense</div>
          <div className="font-semibold text-lg">{defense} 🛡️</div>
        </div>

        <div className="p-2 bg-neutral-900/40 rounded border border-neutral-700/50">
          <div className="opacity-70 text-xs uppercase tracking-wider">Crit. Chance</div>
          <div className="font-semibold text-lg">{crit_chance}% 💥</div>
        </div>
      </div>
    </section>
  );
};