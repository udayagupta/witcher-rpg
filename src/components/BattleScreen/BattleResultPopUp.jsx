import { useEffect, useRef, useState, useMemo } from "react";
import { generateLoot } from "../../utils/battle";
import items from "../../data/items.json";
import { calculateMonsterExp, playSound } from "../../utils/utils";
import { usePlayerStore } from "../../store/usePlayerStore";
import Icon from "../Icon";

const BattleResultPopUp = ({ monsterData, battleResult, handleGameMode }) => {
  const isVictory = battleResult === "player";

  // Zustand state
  const addToInventory = usePlayerStore((state) => state.addToInventory);
  const updateLevelExp = usePlayerStore((state) => state.updateLevelExp);
  const updateQuests = usePlayerStore((state) => state.updateQuests);
  const discoverMonster = usePlayerStore((state) => state.discoverMonster);
  const updateMonsterStats = usePlayerStore((state) => state.updateMonsterStats);
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  const [lootGenerated] = useState(() => generateLoot(monsterData.drops));
  const xpGained = isVictory ? calculateMonsterExp(monsterData.base_exp) : 0;

  const loadingTips = [
    "Use oils that monsters are vulnerable to. Check out the Bestiary to find out monster weaknesses.",
    "Struggling with a contract? Try hunting easier monsters to level up and boost your base stats.",
    "Potions like Swallow can regenerate your Vitality during tough battles. Keep your inventory stocked.",
    "Crafting better Witcher gear is essential for survival. Gather resources and upgrade often."
  ];

  const hasProcessedRewards = useRef(false);

  const randomTip = useMemo(() => {
    return loadingTips[Math.floor(Math.random() * loadingTips.length)];
  }, []);


  useEffect(() => {

    if (hasProcessedRewards.current) return;

    if (isVictory) {
      playSound("quest_completed");
      updateLevelExp(xpGained);
      updateQuests(monsterData.id);
      discoverMonster(monsterData.id);
      updateMonsterStats(monsterData.id, monsterData.is_monster);
      lootGenerated.forEach((loot) => {
        addToInventory(loot.id, loot.qty, loot.type);
      });
    } else {
      playSound("dead");
      setPlayer((prev) => ({ ...prev, stats: { ...prev.stats, totalDeaths: prev.stats.totalDeaths + 1 }}))
    }

    hasProcessedRewards.current = true;
  }, [isVictory, xpGained, monsterData.id, lootGenerated, updateLevelExp, addToInventory]);

  return (
    battleResult && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`relative bg-neutral-900/95 border-2 rounded-xl p-6 min-w-[360px] shadow-xl animate-fade-in ${isVictory ? "border-amber-300" : "border-red-600"
          }`}
      >
        <h3
          className={`witcher-font text-3xl text-center mb-3 ${isVictory ? "text-amber-300" : "text-red-500"
            }`}
        >
          {isVictory ? "Victory!" : "Defeat"}
        </h3>

        {isVictory ? (
          <div className="text-center text-neutral-200">
            <p className="text-lg mb-2">
              You have defeated the <span className="text-amber-300">{monsterData.name}</span>!
            </p>

            <p className="text-sm text-neutral-400 mb-2">
              XP Gained: <span className="text-amber-300 font-semibold">{xpGained}</span>
            </p>

            {lootGenerated.length > 0 ? (
              <div>
                <p className="text-neutral-400 italic mb-1">Loot received:</p>
                <ul className="mt-3 flex gap-1 text-sm justify-center">
                  {lootGenerated.map((loot) => (
                    <li key={loot.id} className="relative p-2 w-[100px] h-[100px] heading text-amber-200 card">
                      <span className="absolute top-1 right-1 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 z-10">
                        {loot.qty === -1 ? '∞' : `x${loot.qty}`}
                      </span>
                      <Icon id={loot.id} type={loot.type} size={45} />
                      <p className="text-xs">{items[loot.type][loot.id].name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-neutral-500 italic mt-3">No loot received.</p>
            )}
          </div>
        ) : (
          <div className="text-center text-neutral-300">
            <p>
              You were defeated by{" "}
              <span className="text-red-400">{monsterData.name}</span>. Try again!
            </p>
            <p className="text-sm my-5 text-neutral-300">{randomTip}</p>
          </div>
        )}

        <button
          onClick={() => {handleGameMode("explore"); playSound("equip")}}
          className={`cursor-pointer mt-5 mx-auto block witcher-font px-4 py-2 rounded-md text-sm border transition ${isVictory
            ? "border-amber-300 hover:bg-amber-300 hover:text-black"
            : "border-red-500 hover:bg-red-500 hover:text-black"
            }`}
        >
          Continue
        </button>
      </div>
    </div>)
  );
};

export default BattleResultPopUp;
