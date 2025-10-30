import { useEffect, useState } from "react";
import monstersData from "../../data/monster.json";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { playerSilverDamage, monsterDamage, isAlive } from "../../utils/battle";
import HealthBar from "../PlayerProfile/HealthBar";
import MonsterHealth from "./MonsterHealth";
import WonScreen from "./WonScreen";

const BattleScreen = ({ monsterId }) => {
  const { player, takeDamage, setPlayer, resetVitality } = usePlayer();
  const [monsterData, setMonsterData] = useState(monstersData[monsterId]);
  const [appliedOil, setAppliedOil] = useState(null);
  const [battleLogs, setBattleLogs] = useState([
    `You've encountered a ${monsterData.name}.`,
  ]);
  const [turns, setTurns] = useState(1);
  const [battleResult, setBattleResult] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("player");

  const handlePlayerSilverAttack = () => {
    if (currentTurn === "monster") return;

    const playerAttack = playerSilverDamage(
      player,
      monsterData.weakness.oil,
      appliedOil
    );
    setMonsterData((prev) => ({
      ...prev,
      vitality: Math.max(0, prev.vitality - playerAttack.playerAttackDmg),
    }));
    setBattleLogs((prev) => [...prev, playerAttack.log]);
    setCurrentTurn("monster");
  };

  const handlePlayerIgni = () => {};
  const handlePlayerYrden = () => {};
  const handlePlayerQuen = () => {};
  const handlePlayerAard = () => {};
  const handlePlayerAxii = () => {};

  const handleWin = () => {
    const monsterAlive = isAlive(monsterData.vitality);
    const playerAlive = isAlive(player.vitality);

    if (!monsterAlive && playerAlive) {
      setBattleResult("player");
    }

    if (monsterAlive && !playerAlive) {
      setBattleResult("monster");
    }

    if (!monsterAlive && !playerAlive) {
      setBattleResult("draw");
    }
  }

  const playerActions = [
    { name: "Silver Attack", handler: handlePlayerSilverAttack },
    { name: "Igni", handler: handlePlayerIgni },
    { name: "Yrden", handler: handlePlayerYrden },
    { name: "Quen", handler: handlePlayerQuen },
    { name: "Aard", handler: handlePlayerAard },
    { name: "Axii", handler: handlePlayerAxii },
  ];

  useEffect(() => {
    if (currentTurn === "monster" && isAlive(monsterData)) {
      const timeout = setTimeout(() => {
        const dmg = monsterDamage(monsterData, player.defense);

        setBattleLogs((prev) => [...prev, dmg.log]);
        takeDamage(dmg.monsterAttackDmg);

        setCurrentTurn("player");
        setTurns((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentTurn]);

  useEffect(() => {
    handleWin();
  }, [player.vitality, monsterData.vitality]);

  return (
    <div className="h-full">
      <h3 className="witcher-font heading text-3xl text-amber-300">Battle</h3>

      {battleResult === null ? (
        <div className="h-full">
          <div className="player-and-monster-f2f flex items-stretch gap-5">
            <div
              className={`player rounded-md flex-1 w-full p-2 transition duration-300 ${
                currentTurn === "player"
                  ? "border border-amber-300"
                  : "border border-transparent "
              }`}
            >
              <p className="witcher-font heading ">{player.name}</p>
              <HealthBar />
              <img
                src={`./images/geralt.png`}
                alt=""
                className="mt-10 w-full h-[300px] object-contain"
              />
            </div>

            <div className="battle-logs  bg-neutral-800 rounded-md flex-1 p-2">
              <h3 className="heading witcher-font">Battle Logs</h3>
              <ul className="overflow-auto max-h-[400px]">
                {battleLogs.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
            </div>

            <div
              className={`monster flex-1 rounded-md p-2 transition duration-300 ${
                currentTurn === "monster"
                  ? "border border-amber-300"
                  : "border border-transparent"
              }`}
            >
              <p className="witcher-font heading ">{monsterData.name}</p>
              <MonsterHealth
                current={monsterData.vitality}
                max={monsterData.max_vitality}
                className="mb-2"
              />
              <img
                src={`./images/${monsterId}.png`}
                alt=""
                className="w-full object-contain"
              />
            </div>
          </div>

          <ul className="player-actions items-list">
            {playerActions.map((action) => (
              <li
                key={action.name}
                onClick={action.handler}
                className="p-2 rounded-md border cursor-pointer transition witcher-font border-neutral-700 hover:text-amber-300 hover:border-amber-300"
              >
                {action.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <WonScreen battleResult={battleResult} monsterId={monsterId}/>
      )}
    </div>
  );
};

export default BattleScreen;
