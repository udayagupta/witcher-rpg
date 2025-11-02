import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { generateLoot } from "../../utils/battle";
import monstersData from "../../data/monster.json";
import { useEffect } from "react";

const PlayerWon = ({ monsterId }) => {
  const { player } = usePlayer();
  const monsterData = monstersData[monsterId];

  useEffect(() => {
    generateLoot(monsterData.drops);
  }, [monsterId])

  return (
    <div className="border h-full">
      <h3 className="witcher-font">{player.name} won the battle</h3>
    </div>
  );
};

export default PlayerWon;
