import { motion } from 'motion/react';
import { usePlayer } from '../../store/usePlayerStore';

const MonsterHunting = ({ props }) => {
  const { subLocationData, setSelectedMonster, setGameMode, setPlayer, monsterData } = props;
  const player = usePlayer();
  const oversizedMonsters = [];

  return (
    <div className="monster-hunting">
      <h4 className="text-amber-300 text-2xl witcher-font">
        Monster Hunting
      </h4>

      {subLocationData["monsters_found"] ? (
        <ul className="flex flex-wrap gap-6 justify-center p-4 mt-2">
          {subLocationData["monsters_found"]?.map((monster) => {
            const currentMonster = monsterData[monster];
            const isOversized = oversizedMonsters.includes(monster);
            const isDiscovered = player.discoveredMonsters.includes(currentMonster.id);
            const difficultyColor =
              currentMonster.difficulty === "Hard" ? "text-red-500" :
                currentMonster.difficulty === "Medium" ? "text-amber-500" :
                  "text-green-500";

            return (
              <motion.li
                key={monster}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col items-center justify-between w-48 h-64 p-4 cursor-pointer bg-neutral-900/80 border border-neutral-700 hover:border-red-900/80 rounded-lg shadow-lg hover:shadow-red-900/20 transition-all"
                onClick={() => {
                  setSelectedMonster(monster);
                  setGameMode("battle");
                  setPlayer(prev => ({ ...prev, inBattle: true }));
                }}
              >
                <p className="witcher-font text-xl font-semibold text-neutral-200 group-hover:text-red-400 transition-colors tracking-wide z-10 text-center">
                  {isDiscovered ? currentMonster.name : "Unidentified"}
                </p>

                <div className="flex-1 w-full flex items-center justify-center overflow-visible mt-2 mb-2 relative">
                  <div className="absolute inset-0 bg-red-900/0 rounded-full blur-xl group-hover:bg-red-900/20 transition-colors duration-500"></div>

                  <img
                    src={`./images/${monster}.png`}
                    alt={currentMonster.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150/171717/FFFFFF?text=No+Image"; 
                    }}
                    className={`w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] ${!isDiscovered ? 'brightness-0 opacity-50' : 'drop-shadow-lg'} transition-transform duration-300 relative z-10
                      ${isOversized
                          ? "scale-90 group-hover:scale-100" 
                          : "scale-105 group-hover:scale-110" 
                        }
                    `}
                  />
                </div>

                <div className="flex items-center gap-2 mt-auto z-10 bg-neutral-950/80 px-3 py-1 rounded border border-neutral-800 group-hover:border-red-900/50 transition-colors">
                  <span className="text-sm">💀</span>
                  <p className={`witcher-font tracking-wider ${difficultyColor}`}>
                    {currentMonster.difficulty}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xl text-neutral-400 mt-4 italic">
          No monsters to hunt here. Try searching somewhere else.
        </p>
      )}
    </div>
  );
}

export default MonsterHunting;