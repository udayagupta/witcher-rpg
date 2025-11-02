import PlayerWon from "./PlayerWon";
import MonsterWon from "./MonsterWon";

const WonScreen = ({ battleResult, monsterId }) => {
  return battleResult === "player" ? (
    <PlayerWon monsterId={monsterId}/>
  ) : (
    <MonsterWon monsterId={monsterId}/>
  );
};

export default WonScreen;
