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
  handleAxii,
  handleAard,
} from "../utils/battle";
import monstersData from "../data/monster.json";

export const useBattle = (monsterId) => {
  const { player, takeDamage, resetVitality, setPlayer, usedASign, increaseStamina, heal, affectPlayerDefense } = usePlayer();
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
  };

  const affectMonsterDefense = (modifier) => {
    const initDefense = monstersData[monsterId].defense;

    setMonsterData((prev) => ({
      ...prev,
      defense: prev.defense + (initDefense*modifier)
    }))
    
    console.log(`monster def before: ${initDefense} and after ${monsterData.defense}`)
  }

  const handleRanOutOfStamina = (staminaReq) => {
    if (player.stamina < staminaReq) {
      addLog(`${player.name} does not have enough stamina. Required: ${staminaReq}`)
      return true;
    }

    usedASign(staminaReq);
    return false;
  }

  const damageMonster = (amount, monsterDef) => {
    // const defMultiplier = 100 / (monsterDef + 100)
    setMonsterData((prev) => ({
      ...prev,
      // vitality: Math.max(0, prev.vitality - (amount*defMultiplier)),
      vitality: Math.max(0, prev.vitality - amount)
    }));
  }

  const resetMonsterDef = () => {
    const initDefense = monstersData[monsterId].defense;
    setMonsterData(prev => ({...prev, defense: initDefense}));
  }

  const applyOil = (oil, id) => {
    setBattleState((prev) => ({
      ...prev,
      appliedOil: { name: oil, duration: 5, id: id }
    }))
    addLog(`${player.name} applied ${oil} to it's sword for 5 turns.`)
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
    
    if (battleState.appliedOil) {
      setBattleState((prev) => ({
        ...prev,
        appliedOil: prev.appliedOil.duration > 0 ? { ...prev.appliedOil, duration: prev.appliedOil.duration-1 } : null
      }))
    }

    const playerAttack = playerSilverDamage(
      player,
      monsterData,
      battleState.appliedOil
    );

    damageMonster(parseInt(playerAttack.playerAttackDmg));
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

    addLog(healEffect.log);
    heal(healEffect.heal);
    changeTurn("monster");

  };
  const handlePlayerAard = () => { 
    if (battleState.currentTurn === "monster") return;
    if (handleRanOutOfStamina(25)) return;
    
    const result = handleAard(player, monsterData);

    addLog(result.log)
    changeTurn("monster");
    damageMonster(result.damage);
  };

  const handlePlayerAxii = () => { };

  const playerActions = [
    { name: "Silver Attack", handler: handlePlayerSilverAttack },
    { name: "Igni", handler: handlePlayerIgni },
    { name: "Quen", handler: handlePlayerQuen },
    { name: "Aard", handler: handlePlayerAard },
    { name: "Yrden", handler: handlePlayerYrden },
    { name: "Axii", handler: handlePlayerAxii },
    // { name: "Dodge", handler: handlePlayerDodge },
    // { name: "Guard Up", handler: handlePlayerGuardUp },
    // { name: "Steel Sword", handler: handlePlayerSteelAttack }
  ];

  const handleMonsterTurn = () => {
    const dmg = monsterDamage(monsterData, player.defense);
    const buffId = dmg.buff ? dmg.buff.id : null;

    addLog(dmg.log);
    changeTurn("player");
    updateBuffs("player", battleState, setBattleState, buffId);

    takeDamage(dmg.monsterAttackDmg);
    applyEffects("monster", battleState, setBattleState, monsterData, player, takeDamage, damageMonster, heal, healMonster, affectMonsterDefense, affectPlayerDefense);
  };

  const handleTurn = () => {
    if (battleState.currentTurn === "monster" && isAlive(monsterData)) {
      applyEffects("player", battleState, setBattleState, monsterData, player, takeDamage, damageMonster, heal, healMonster, affectMonsterDefense, affectPlayerDefense);
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

  return { battleState, setBattleState, playerActions, addLog, monsterData, applyOil };
};
