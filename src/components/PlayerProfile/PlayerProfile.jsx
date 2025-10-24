import { usePlayer } from "../../context/PlayerContext/PlayerContext";


export const PlayerProfile = ({className}) => {
  const { player } = usePlayer();
  
  return (
    <section className={`${className} player-profile w-full p-4`}>
      <h2 className="text-xl font-bold mb-2">{player.fullName}</h2>
      <p className="text-sm mb-4">Level {player.level}</p>
      <div
        title={`${player.vitality} out of ${player.maxVitality}`}
        className="health h-[30px] border-2 border-amber-600 rounded overflow-hidden"
      >
        <div
          className="health-bar h-full bg-red-600 transition-all duration-300"
          style={{ width: `${(player.vitality / player.maxVitality) * 100}%` }}
        ></div>
      </div>

      <p className="text-sm mt-2">
        ❤️ {player.vitality}/{player.maxVitality}
      </p>
      <p>Defense: {player?.defense}</p>
      <p>Steel Sword: {player.attack?.steelAttack.join("-")} ATK</p>
      <p>Silver Sword: {player.attack?.silverAttack.join("-")} ATK</p>
    </section>
  );
};
