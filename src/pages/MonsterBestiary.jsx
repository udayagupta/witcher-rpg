import { useState } from "react";
import monstersData from "../data/monster.json";
import { usePlayer } from "../store/usePlayerStore";
import items from "../data/items.json";
import Icon from "../../src/components/Icon";

const SelectedMonsterCard = ({ selectedMonster, player, setSelectedMonster }) => {
  const onClose = () => { setSelectedMonster(null) }

  const selectedMonsterData = monstersData[selectedMonster];
  const isDiscovered = player.discoveredMonsters.includes(selectedMonster);

  return (
    <div className="relative bg-neutral-900 border border-neutral-700 flex flex-col w-[650px] max-h-[550px] overflow-auto p-8 rounded-lg shadow-2xl text-white">
      <button
        onClick={onClose}
        className="absolute cursor-pointer top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors font-bold text-lg"
        title="Close Details"
      >
        ✕
      </button>

      <img
        src={`./images/${selectedMonster}.png`}
        alt={selectedMonsterData?.name}
        className={`w-full h-[250px] object-contain transition-all ${!isDiscovered ? 'grayscale contrast-200 brightness-50' : ''}`}
      />

      <p className="witcher-font text-4xl text-amber-300 text-center mt-2">
        {isDiscovered ? selectedMonsterData?.name : "Unidentified Beast"}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <p className="italic text-neutral-300 border-l-3 border-amber-500 pl-3">
          "{selectedMonsterData?.bestiary_entry}"
        </p>

        <div className=" p-4">
          <p className="mb-2">
            <span className="opacity-80 text-sm uppercase tracking-wider text-amber-500">Weakness — Oils:</span>{" "}
            <span className="font-semibold text-lg ml-2">
              {(selectedMonsterData?.weakness?.oil || []).join(", ") || "None"}
            </span>
          </p>
          <p className="mb-2">
            <span className="opacity-80 text-sm uppercase tracking-wider text-blue-400">Weakness — Signs:</span>{" "}
            <span className="font-semibold text-lg ml-2">
              {(selectedMonsterData?.weakness?.signs || []).join(", ") || "None"}
            </span>
          </p>
          <p>
            <span className="opacity-80 text-sm uppercase tracking-wider text-red-400">Buffs/Attacks:</span>{" "}
            <span className="capitalize font-semibold text-lg ml-2">
              {(selectedMonsterData?.buffs || []).join(", ") || "None"}
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
                {selectedMonsterData?.drops?.map((drop) => {
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
    </div>
  );
};

const MonsterBestiary = () => {
  const [selectedMonster, setSelectedMonster] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const player = usePlayer();

  const filteredMonsters = Object.values(monstersData).filter((monsterData) => {
    const query = searchQuery.toLowerCase();

    return (
      monsterData.name.toLowerCase().includes(query) ||
      monsterData.species.toLowerCase().includes(query) ||
      monsterData.difficulty.toLowerCase().includes(query) ||

      monsterData.weakness.oil.some(oil => oil.toLowerCase().includes(query)) ||
      monsterData.weakness.signs.some(sign => sign.toLowerCase().includes(query)) ||

      monsterData.drops.some((drop) => drop.id.toLowerCase().includes(query))
    );
  });

  return (
    <section className="relative h-full  flex gap-5 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg p-4">

      <div className="overflow-y-auto custom-scrollbar pr-2 w-full">
        <h3 className="text-3xl p-2 witcher-font text-amber-300 border-b border-neutral-700 mb-4">Discovered Monsters</h3>

        <div className="w-max mb-4">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" name="" id="" placeholder="Search..." className="py-2 px-5 witcher-font border rounded-md border-neutral-700 active:outline-none active:border-amber-300 focus:outline-none focus:border-amber-300" />
        </div>
        <ul className="flex flex-wrap gap-4 justify-center items-start p-2">
          {filteredMonsters.map((key) => {
            const isSelected = key.id === selectedMonster;
            const isDiscovered = player.discoveredMonsters.includes(key.id);
            if (!isDiscovered) return;
            return (
              <li
                key={key.id}
                onClick={() => setSelectedMonster(key.id)}
                className={`group flex flex-col items-center justify-between w-32 h-36 p-3 cursor-pointer rounded-lg shadow-md transition-all duration-300 ${isSelected
                  ? "border-2 border-amber-300 bg-neutral-900"
                  : "border border-neutral-700 bg-neutral-900/60 hover:border-amber-300 hover:bg-neutral-800"
                  }`}
              >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={`./images/${key.id}.png`}
                    alt={monstersData[key.id].name}
                    className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${!isDiscovered ? 'brightness-0 opacity-50' : 'drop-shadow-lg'}`}
                  />
                </div>
                <p
                  className={`text-sm font-semibold text-center tracking-wide leading-tight mt-3 witcher-font ${isSelected ? "text-amber-300" : "text-neutral-300 group-hover:text-amber-300"
                    }`}
                >
                  {isDiscovered ? monstersData[key.id].name : "???"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {
        (selectedMonster && (

          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
            <SelectedMonsterCard selectedMonster={selectedMonster} player={player} setSelectedMonster={setSelectedMonster} />
          </div>
        ))
      }

    </section>
  );
};

export default MonsterBestiary;