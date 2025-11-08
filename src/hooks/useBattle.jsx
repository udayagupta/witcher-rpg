import { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext/PlayerContext";
import {
  playerSilverDamage,
  isAlive,
  monsterDamage,
  handleIgni,
  handleQuen,
  updateBuffs,
  applyEffects,
} from "../utils/battle";
import monstersData from "../data/monster.json";

export const useBattle = (monsterId) => {
  const { player, takeDamage, resetVitality, setPlayer, usedASign, increaseStamina, heal } = usePlayer();
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

  const changeTurn = (newTurn) => {
    setBattleState((prev) => ({
      ...prev,
      currentTurn: newTurn
    }))
  }

  const handleRanOutOfStamina = (staminaReq) => {
    if (player.stamina < staminaReq) {
      addLog(`${player.name} consumed all its stamina and can't use the signs anymore.`)
      return true;
    }

    usedASign(staminaReq);
    return false;
  }

  const damageMonster = (amount) => {
    setMonsterData((prev) => ({
      ...prev,
      vitality: Math.max(0, prev.vitality - amount),
    }));
  }

  const addLog = (log) =>
    setBattleState((prev) => ({
      ...prev,
      battleLogs: [...prev.battleLogs, log],
    }));

  const healMonster = (amount) => {
    setMonsterData((prev) => ({
      ...prev,
      vitality: Math.min(prev.vitality + amount, prev.max_vitality)
    }))
  }

  const handlePlayerSilverAttack = () => {
    if (battleState.currentTurn === "monster") return;

    const playerAttack = playerSilverDamage(
      player,
      monsterData.weakness.oil,
      battleState.appliedOil
    );

    damageMonster(playerAttack.playerAttackDmg);
    addLog(playerAttack.log);
    changeTurn("monster");
    increaseStamina(10);
  };

  const handlePlayerIgni = () => {
    if (battleState.currentTurn === "monster") return;
    if (handleRanOutOfStamina(20)) return;

    const damage = handleIgni(0.5, player, monsterData, battleState);
    const effectId = damage.isBurning ? "burn" : null;

    addLog(damage.log);
    changeTurn("monster");
    damageMonster(damage.damage);
    updateBuffs("monster", battleState, setBattleState, effectId);

  };
  const handlePlayerYrden = () => { };
  const handlePlayerQuen = () => {
    if (battleState.currentTurn === "monster") return;
    if (handleRanOutOfStamina(25)) return;
    const healEffect = handleQuen(0.1, player, monsterData);
    // const effectId = heal.isRegenerate ? ""

    addLog(healEffect.log);
    heal(healEffect.heal);
    changeTurn("monster");

  };
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
    changeTurn("player");
    updateBuffs("player", battleState, setBattleState, buffId);

    takeDamage(dmg.monsterAttackDmg);
    applyEffects("monster", battleState, setBattleState, monsterData, player, takeDamage, damageMonster, heal, healMonster);
  };

  const handleTurn = () => {
    if (battleState.currentTurn === "monster" && isAlive(monsterData)) {
      applyEffects("player", battleState, setBattleState, monsterData, player, takeDamage, damageMonster, heal, healMonster);
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
      increaseStamina(100);
    }

    if (monsterAlive && !playerAlive) {
      setBattleState((prev) => ({ ...prev, battleResult: "monster" }));
      resetVitality();
      increaseStamina(100);
      setPlayer((prev) => ({ ...prev, inBattle: false }));
    }
  };

  useEffect(handleTurn, [battleState.currentTurn]);
  useEffect(handleWin, [monsterData.vitality, player.vitality]);

  return { battleState, setBattleState, playerActions, addLog, monsterData };
};
