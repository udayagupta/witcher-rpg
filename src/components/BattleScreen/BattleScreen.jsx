import WonScreen from "./WonScreen";
import BattleScreenUI from "./BattleScreenUI";
import { useBattle } from "../../hooks/useBattle";
import BattleResultPopUp from "./BattleResultPopUp";

const BattleScreen = ({ monsterId, exit, handleGameMode }) => {
  const { battleState, setBattleState, playerActions, addLog, monsterData } = useBattle(monsterId);

  return (
    <div className="h-full">
      <h3 className="witcher-font heading text-3xl text-amber-300">Battle</h3>
        <BattleScreenUI
          battleState={battleState}
          monsterData={monsterData}
          monsterId={monsterId}
          playerActions={playerActions}
          exit={exit}
        />

        {battleState.battleResult && <BattleResultPopUp handleGameMode={handleGameMode} battleResult={battleState.battleResult} monsterData={monsterData} />}
    </div>
  );
};

export default BattleScreen;
