import { useEffect, useState, useCallback } from "react";
import {
  isAlive,
  monsterDamage,
  handleIgni,
  handleQuen,
  updateBuffs,
  applyEffects,
  handleAard,
  playerSwordDamage,
} from "../utils/battle";
import monstersData from "../data/monster.json";
import { usePlayer, usePlayerStore } from "../store/usePlayerStore";

export const useBattle = (monsterId) => {

  const player = usePlayer();
  const takeDamage = usePlayerStore((state) => state.takeDamage);
  const resetVitality = usePlayerStore((state) => state.resetVitality);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const usedASign = usePlayerStore((state) => state.usedASign);
  const increaseStamina = usePlayerStore((state) => state.increaseStamina);
  const heal = usePlayerStore((state) => state.heal);
  const consumeItem = usePlayerStore((state) => state.consumeItem);

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


  const applyOil = (oil, id) => {
    setBattleState((prev) => ({
      ...prev,
      appliedOil: { name: oil, duration: 5, id: id }
    }))
    addLog(`${player.name} applied ${oil} to it's sword for 5 turns.`);
    consumeItem(id, "oil", 1);
  }

  const addLog = useCallback((log) => {
    setBattleState((prev) => ({
      ...prev,
      battleLogs: [...prev.battleLogs, log],
    }));
  }, []);

  const healMonster = (amount) => {
    setMonsterData((prev) => ({
      ...prev,
      vitality: Math.min(prev.vitality + amount, prev.max_vitality)
    }))
  }

 const handleSwordAttack = (swordType) => {
    if (battleState.currentTurn === "monster") return;
    
    let currentOil = battleState.appliedOil;
    if (currentOil) {
      currentOil = currentOil.duration > 1 
        ? { ...currentOil, duration: currentOil.duration - 1 } 
        : null;
        
      setBattleState(prev => ({ ...prev, appliedOil: currentOil }));
    }

    const damageCalc = swordType === "silver" 
      ? playerSwordDamage(player, monsterData, "silver", currentOil, battleState)
      : playerSwordDamage(player, monsterData, "steel", currentOil, battleState);

    damageMonster(damageCalc.playerAttackDmg);
    addLog(damageCalc.log);
    increaseStamina(10);
    changeTurn("monster");
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

  const handlePlayerQuen = () => {
    if (battleState.currentTurn === "monster") return;
    if (handleRanOutOfStamina(25)) return;
    const healEffect = handleQuen(0.1, player, monsterData, battleState);

    addLog(healEffect.generatedLog);
    heal(healEffect.heal);
    changeTurn("monster");

  };
  
  const handlePlayerAard = () => { 
    if (battleState.currentTurn === "monster") return;
    if (handleRanOutOfStamina(25)) return;
    
    const result = handleAard(player, monsterData, battleState);

    addLog(result.log)
    changeTurn("monster");
    damageMonster(result.damage);
  };

  const playerActions = [
    { name: "Silver Attack", handler: () => handleSwordAttack("silver") },
    { name: "Steel Sword", handler: () => handleSwordAttack("steel") },
    { name: "Igni", handler: handlePlayerIgni },
    { name: "Quen", handler: handlePlayerQuen },
    { name: "Aard", handler: handlePlayerAard },
  ];


  useEffect(() => {
    if (battleState.currentTurn !== "monster" || !isAlive(monsterData) || battleState.battleResult) return;
    
    const executeMonsterTurn = () => {
      applyEffects("monster", battleState, setBattleState, monsterData, player, takeDamage, damageMonster, heal, healMonster);
      applyEffects("player", battleState, setBattleState, monsterData, player, takeDamage, damageMonster, heal, healMonster);
      
      const dmg = monsterDamage(monsterData, player.defense, battleState, player);
      takeDamage(dmg.monsterAttackDmg);
      addLog(dmg.log);

      const buffId = dmg.buff ? dmg.buff.id : null;
      updateBuffs("player", battleState, setBattleState, buffId);
      changeTurn("player");
    };

    const timeout = setTimeout(executeMonsterTurn, 1500);
    return () => clearTimeout(timeout);
    
  }, [battleState.currentTurn, monsterData]);

  useEffect(() => {
    if (battleState.battleResult) return;

    const monsterAlive = isAlive(monsterData);
    const playerAlive = isAlive(player);

    if (!monsterAlive && playerAlive) {
      setBattleState((prev) => ({ ...prev, battleResult: "player" }));
      // setPlayer((prev) => ({ ...prev, inBattle: false }));
      setPlayer({ inBattle: false });
      increaseStamina(100);
    }

    if (monsterAlive && !playerAlive) {
      setBattleState((prev) => ({ ...prev, battleResult: "monster" }));
      resetVitality();
      increaseStamina(100);
      // setPlayer((prev) => ({ ...prev, inBattle: false }));
      setPlayer({ inBattle: false });
    }

  }, [player.vitality, monsterData.vitality]);


  return { battleState, setBattleState, playerActions, addLog, monsterData, applyOil };
};
