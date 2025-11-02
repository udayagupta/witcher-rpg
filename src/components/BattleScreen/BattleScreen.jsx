import WonScreen from "./WonScreen";
import BattleScreenUI from "./BattleScreenUI";
import { useBattle } from "../../hooks/useBattle";

const BattleScreen = ({ monsterId }) => {
  const { battleState, setBattleState, playerActions, addLog, monsterData } = useBattle(monsterId);

  return (
    <div className="h-full">
      <h3 className="witcher-font heading text-3xl text-amber-300">Battle</h3>

      {battleState.battleResult === null ? (
        <BattleScreenUI
          battleState={battleState}
          monsterData={monsterData}
          monsterId={monsterId}
          playerActions={playerActions}
        />
      ) : (
        <WonScreen
          battleResult={battleState.battleResult}
          monsterId={monsterId}
        />
      )}
    </div>
  );
};

export default BattleScreen;
