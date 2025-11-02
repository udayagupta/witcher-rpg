import React, { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext/PlayerContext";
import {
  playerSilverDamage,
  checkIfEffectExists,
  isAlive,
  monsterDamage,
  updateDuration,
  handleIgni,
} from "../utils/battle";
import monstersData from "../data/monster.json";

export const useBattle = (monsterId) => {
  const { player, takeDamage, resetVitality, setPlayer, usedASign, increaseStamina } = usePlayer();
  const [monsterData, setMonsterData] = useState(monstersData[monsterId]);
  const [battleState, setBattleState] = useState({
    appliedOil: null,
    battleLogs: [`${player.name} encountered a ${monsterData.name}.`],
    turns: 0,
    battleResult: null,
    currentTurn: "player",
    playerDebuffs: [],
    monsterDebuffs: [],
  });

  const addLog = (log) =>
    setBattleState((prev) => ({
      ...prev,
      battleLogs: [...prev.battleLogs, log],
    }));

  const handlePlayerSilverAttack = () => {
    if (battleState.currentTurn === "monster") return;

    const playerAttack = playerSilverDamage(
      player,
      monsterData.weakness.oil,
      battleState.appliedOil
    );

    setMonsterData((prev) => ({
      ...prev,
      vitality: Math.max(0, prev.vitality - playerAttack.playerAttackDmg),
    }));

    setBattleState((prev) => ({
      ...prev,
      battleLogs: [...prev.battleLogs, playerAttack.log],
      currentTurn: "monster",
    }));

    increaseStamina(10);
  };

  const handlePlayerIgni = () => {
    if (player.stamina < 20) {
      addLog(`${player.name} consumed all its stamina and can't use the signs anymore.`)
      return;
    }

    const damage = handleIgni(0.1, player, monsterData);
    addLog(damage.log);
    usedASign();

    setBattleState((prev) => ({
      ...prev,
      currentTurn: "monster"
    }));

    setMonsterData((prev) => ({
      ...prev,
      vitality: Math.max(0, prev.vitality - damage.damage)
    }))
  };
  const handlePlayerYrden = () => { };
  const handlePlayerQuen = () => { };
  const handlePlayerAard = () => { };
  const handlePlayerAxii = () => { };

  const playerActions = [
    { name: "Silver Attack", handler: handlePlayerSilverAttack },
    { name: "Igni", handler: handlePlayerIgni },
    { name: "Yrden", handler: handlePlayerYrden },
    { name: "Quen", handler: handlePlayerQuen },
    { name: "Aard", handler: handlePlayerAard },
    { name: "Axii", handler: handlePlayerAxii },
  ];

  const handleMonsterTurn = () => {
    const dmg = monsterDamage(monsterData, player.defense);
    const buffId = dmg.buff ? dmg.buff.id : null;

    addLog(dmg.log);
    setBattleState((prev) => ({
      ...prev,
      currentTurn: "player",
      turns: prev.turns + 1,
    }));

    if (buffId && !checkIfEffectExists(battleState.playerDebuffs, buffId)) {
      setBattleState((prev) => ({
        ...prev,
        playerDebuffs: [...prev.playerDebuffs, dmg.buff],
      }));
    }

    if (
      buffId &&
      checkIfEffectExists(battleState.playerDebuffs, buffId) &&
      effectsData[buffId].canStack
    ) {
      setBattleState((prev) => ({
        ...prev,
        playerDebuffs: updateDuration(
          prev.playerDebuffs,
          buffId,
          effectsData[buffId].duration
        ),
      }));
    }

    takeDamage(dmg.monsterAttackDmg);
  };

  const handleTurn = () => {
    if (battleState.currentTurn === "monster" && isAlive(monsterData)) {
      const timeout = setTimeout(handleMonsterTurn, 1500);
      return () => clearTimeout(timeout);
    }
  };

  const handleWin = () => {
    const monsterAlive = isAlive(monsterData);
    const playerAlive = isAlive(player);
    if (!monsterAlive && playerAlive) {
      setBattleState((prev) => ({ ...prev, battleResult: "player" }));
      setPlayer((prev) => ({ ...prev, inBattle: false }));
    }

    if (monsterAlive && !playerAlive) {
      setBattleState((prev) => ({ ...prev, battleResult: "monster" }));
      resetVitality();
      setPlayer((prev) => ({ ...prev, inBattle: false }));
    }
  };

  useEffect(handleTurn, [battleState.currentTurn]);
  useEffect(handleWin, [monsterData.vitality, player.vitality]);

  return { battleState, setBattleState, playerActions, addLog, monsterData };
};
