import { useState } from "react";
import monstersData from "../data/monster.json";
import { usePlayer } from "../store/usePlayerStore";
import items from "../data/items.json";
import Icon from "../../src/components/Icon";

const SelectedMonsterCard = ({ selectedMonster, player }) => {
  if (!selectedMonster) {
    return (
      <div className="flex flex-col justify-center text-lg items-center h-full text-neutral-300">
        <p>Select a monster to view details.</p>
      </div>
    );
  }

  const selectedMonsterData = monstersData[selectedMonster];
  const isDiscovered = player.discoveredMonsters.includes(selectedMonster);

  return (
    <div className="flex flex-col h-full gap-3 p-4 bg-neutral-900/30 rounded text-white overflow-auto">
      <img
        src={`./images/${selectedMonster}.png`}
        alt={selectedMonsterData.name}
        className={`w-full h-[250px] object-contain transition-all ${!isDiscovered ? 'grayscale contrast-200 brightness-50' : ''}`}
      />

      <p className="witcher-font text-4xl text-amber-300 text-center mt-2">
        {isDiscovered ? selectedMonsterData.name : "Unidentified Beast"}
      </p>

      {isDiscovered ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="italic text-neutral-300 border-l-3 border-amber-500 pl-3">
            "{selectedMonsterData.bestiary_entry}"
          </p>

          <div className=" p-4">
            <p className="mb-2">
              <span className="opacity-80 text-sm uppercase tracking-wider text-amber-500">Weakness — Oils:</span>{" "}
              <span className="font-semibold text-lg ml-2">
                {(selectedMonsterData.weakness?.oil || []).join(", ") || "None"}
              </span>
            </p>
            <p className="mb-2">
              <span className="opacity-80 text-sm uppercase tracking-wider text-blue-400">Weakness — Signs:</span>{" "}
              <span className="font-semibold text-lg ml-2">
                {(selectedMonsterData.weakness?.signs || []).join(", ") || "None"}
              </span>
            </p>
            <p>
              <span className="opacity-80 text-sm uppercase tracking-wider text-red-400">Buffs/Attacks:</span>{" "}
              <span className="capitalize font-semibold text-lg ml-2">
                {(selectedMonsterData.buffs || []).join(", ") || "None"}
              </span>
            </p>
            <div className="bg-neutral-950/50 rounded-md border border-neutral-700 overflow-hidden mt-2">
              <table className="w-full text-left border-collapse">

                {/* Table Header */}
                <thead className="bg-neutral-900">
                  <tr className="text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-700">
                    <th className="py-2 px-3 font-medium">Potential Loot</th>
                    <th className="py-2 px-3 font-medium text-right">Drop Chance</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {selectedMonsterData.drops?.map((drop) => {
                    const dropData = items[drop.type]?.[drop.id];
                    if (!dropData) return null;
                    const dropPercent = Math.round(drop.chance * 100);

                    return (
                      <tr
                        key={drop.id}
                        className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/50 transition-colors"
                      >
                        <td className="py-2 px-3 flex items-center gap-3">
                          <div className=" p-1 rounded-md">
                            <Icon id={dropData.id} type={drop.type} size={28} />
                          </div>
                          <p className="font-semibold text-neutral-200 text-sm">
                            {dropData.name} <span className="text-neutral-500 font-normal text-xs ml-1">(x{drop.qty})</span>
                          </p>
                        </td>

                        <td className="py-2 px-3 text-right">
                          <span className={`font-bold text-sm ${dropPercent >= 50 ? 'text-green-400' : 'text-amber-400'}`}>
                            {dropPercent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center text-neutral-400 text-center">
          <span className="text-4xl mb-4">🗡️</span>
          <p>Defeat this monster in combat at least once to unlock its Bestiary entry and reveal its weaknesses.</p>
        </div>
      )}
    </div>
  );
};

// 2. MAIN COMPONENT
const MonsterBestiary = () => {
  const [selectedMonster, setSelectedMonster] = useState("");
  const player = usePlayer();

  return (
    <section className="h-[120vh] flex gap-5 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg p-4">

      <div className="w-[65%] overflow-y-auto custom-scrollbar pr-2">
        <h3 className="text-3xl p-2 witcher-font text-amber-300 border-b border-neutral-700 mb-4">Discovered Monsters</h3>
        <ul className="flex flex-wrap gap-4 justify-center items-start p-2">
          {Object.keys(monstersData).map((key) => {
            const isSelected = key === selectedMonster;
            const isDiscovered = player.discoveredMonsters.includes(key);
            // if (!isDiscovered) return;
            return (
              <li
                key={key}
                onClick={() => setSelectedMonster(key)}
                className={`group flex flex-col items-center justify-between w-32 h-36 p-3 cursor-pointer rounded-lg shadow-md transition-all duration-300 ${isSelected
                  ? "border-2 border-amber-300 bg-neutral-900"
                  : "border border-neutral-700 bg-neutral-900/60 hover:border-amber-300 hover:bg-neutral-800"
                  }`}
              >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={`./images/${key}.png`}
                    alt={monstersData[key].name}
                    className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${!isDiscovered ? 'brightness-0 opacity-50' : 'drop-shadow-lg'}`}
                  />
                </div>
                <p
                  className={`text-sm font-semibold text-center tracking-wide leading-tight mt-3 witcher-font ${isSelected ? "text-amber-300" : "text-neutral-300 group-hover:text-amber-300"
                    }`}
                >
                  {isDiscovered ? monstersData[key].name : "???"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-[40%] h-full">
        <SelectedMonsterCard selectedMonster={selectedMonster} player={player} />
      </div>

    </section>
  );
};

export default MonsterBestiary;