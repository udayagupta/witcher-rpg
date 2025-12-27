import { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { generateLoot } from "../../utils/battle";
import items from "../../data/items.json";

const BattleResultPopUp = ({ monsterData, battleResult, handleGameMode }) => {
  const isVictory = battleResult === "player";
  const { player, addToInventory } = usePlayer();

  const [lootGenerated] = useState(() => generateLoot(monsterData.drops));
  const xpGained = isVictory ? Math.floor(player.level * 10 + Math.random() * 5) : 0;

  useEffect(() => {
    if (!isVictory) return;
    lootGenerated.forEach((loot) => {
      addToInventory(loot.id, loot.qty, loot.type);
      console.log(loot);
      // itemId, qty, itemCategory
    });
  }, []);

  return (
    battleResult && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`relative bg-neutral-900/95 border-2 rounded-xl p-6 w-[360px] shadow-xl animate-fade-in ${isVictory ? "border-amber-300" : "border-red-600"
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
              <ul className="mt-3 flex flex-col gap-1 text-sm">
                <p className="text-neutral-400 italic mb-1">Loot received:</p>
                {lootGenerated.map((loot, index) => (
                  <li key={index} className="heading text-amber-200">
                    {items[loot.type][loot.id].name} x {loot.qty}
                  </li>
                ))}
              </ul>
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
            <p className="text-sm my-5 text-neutral-300">Tip: Use oils that monsters are vulnerable to. Check out Monster Bestiary for finding out monster weaknesses.</p>
          </div>
        )}

        <button
          onClick={() => handleGameMode("explore")}
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
