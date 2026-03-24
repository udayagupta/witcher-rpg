import { effectsData } from "./effects";
import { generateLogText, checkIfEffectExists, existsAndCanStack } from "./utils";

const SIGN_WEAKNESS_MULTIPLIER = 2;
const SILVER_ATTACK_MULTIPLIER = 1.5;
const STEEL_ATTACK_MULTIPLIER = 1.5;

export const randomInRange = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const playerSwordDamage = (
  player,
  monster,
  swordType,
  appliedOil = null,
  battleState
) => {
  const isSilver = swordType === "silver";

  const minDamage = player.attack[isSilver ? "silverAttack" : "steelAttack"][0];
  const maxDamage = player.attack[isSilver ? "silverAttack" : "steelAttack"][1];
  const damage = randomInRange(minDamage, maxDamage);
  
  const monsterWeakness = monster.weakness.oil;
  const defenseMultiplier = 100 / (monster.defense + 100);

  const oilMultiplier = 1.5;
  const critMultiplier = 1.5;
  const isCrit = Math.random() < (player.crit_chance / 100);

  let playerAttackDmg = 0;

  if (isCrit) {
    playerAttackDmg += damage * critMultiplier * defenseMultiplier;
  } else {
    playerAttackDmg += damage * defenseMultiplier;
  };

  if (appliedOil && appliedOil.duration > 0 && monsterWeakness.includes(appliedOil.name)) {
    playerAttackDmg *= oilMultiplier;
  };

  const isSwordCorrect = isSilver ? monster.is_monster : !monster.is_monster;
  const swordMultiplier = isSilver ? SILVER_ATTACK_MULTIPLIER : STEEL_ATTACK_MULTIPLIER;
  
  if (isSwordCorrect) {
    playerAttackDmg *= swordMultiplier;
  } else {
    playerAttackDmg *= 0.5;
  };

  const action = {
    isCrit,
    damage: Math.round(playerAttackDmg),
    attackedWith: isSilver ? "Silver Sword" : "Steel Sword",
    heal: null,
    withOil: appliedOil,
    attacker: "player",
    defender: "monster",
    effectApplied: null
  };

  return { playerAttackDmg, log: generateLogText(player, monster, action, battleState) }
}


export const monsterDamage = (monster, playerDefense, battleState, player) => {
  const isCrit = Math.random() < monster.crit_chance / 100;
  const damage = randomInRange(monster.attack[0], monster.attack[1]);
  const monsterBuffs = monster.buffs.length > 0 ? monster.buffs[0] : null;
  const effectData = monsterBuffs ? effectsData[monsterBuffs] : null;
  const buffInflictingChance = 0.10;
  const isBuff = Math.random() < buffInflictingChance;

  const critMultiplier = 2;
  const defenseMultiplier = 100 / (playerDefense + 100);

  let monsterAttackDmg = parseInt(
    Math.max(
      0,
      isCrit
        ? damage * critMultiplier * defenseMultiplier
        : damage * defenseMultiplier
    )
  );

  const action = {
    isCrit,
    damage: parseInt(monsterAttackDmg),
    attackedWith: null,
    heal: null,
    withOil: null,
    attacker: "monster",
    defender: "player",
    effectApplied: isBuff ? monsterBuffs : null,
  }

  return {
    monsterAttackDmg,
    buff: isBuff && monsterBuffs ? { id: monsterBuffs, duration: effectData.duration } : null,
    log: generateLogText(player, monster, action, battleState)
  };
};

export const generateLoot = (monsterDrops) => {
  let loot = [];

  monsterDrops.forEach((drop) => {
    const chance = Math.random() < drop.chance;
    if (chance) loot.push({ id: drop.id, qty: drop.qty, type: drop.type });
  });

  // console.log(loot);

  return loot;
};


export const handleIgni = (burnChance = 0.1, player, monster, battleState) => {
  const isBurning = Math.random() < burnChance;
  const effectId = "burn"
  const igniIntensity = player.signsIntensity.igni;
  const monsterWeakness = monster.weakness.signs;
  const monsterDef = monster.defense;
  const defenseMultiplier = 100 / (monsterDef + 100)
  const baseDamage = 40;
  const totalDamage = monsterWeakness.includes("Igni") ? baseDamage*igniIntensity*SIGN_WEAKNESS_MULTIPLIER*defenseMultiplier : baseDamage*igniIntensity*defenseMultiplier;
  const effectData = effectsData[effectId];
  
  const action = {
    isCrit: null,
    damage: parseInt(totalDamage),
    attackedWith: "Igni Sign 🔥",
    heal: null,
    withOil: null,
    attacker: "player",
    defender: "monster",
    effectApplied: isBurning ? "burn" : null,
  }

  return {
    damage: parseInt(totalDamage),
    isBurning: isBurning ? { id: effectData.id, duration: effectData.duration } : null,
    log: generateLogText(player, monster, action, battleState)
  }

};


export const handleAard = (player, monster, battleState) => {

  const aardIntensity = player.signsIntensity.aard;
  const monsterWeakness = monster.weakness.signs;
  const monsterDef = monster.defense;
  const defenseMultiplier = 100 / (monsterDef + 100)
  const baseDamage = 40;
  const totalDamage = parseInt(monsterWeakness.includes("Aard") ? baseDamage*aardIntensity*SIGN_WEAKNESS_MULTIPLIER*defenseMultiplier : baseDamage*aardIntensity*defenseMultiplier);

  
  const action = {
    isCrit: null,
    damage: parseInt(totalDamage),
    attackedWith: "Aard Sign",
    heal: null,
    withOil: null,
    attacker: "player",
    defender: "monster",
    effectApplied: null,
  }

  return {
    damage: totalDamage,
    log: generateLogText(player, monster, action, battleState)
  }
};


export const handleQuen = (defenseUpChance = 0.05, player, monster, battleState) => {
  const isDefenseUp = Math.random() < defenseUpChance;
  const quenIntensity = player.signsIntensity.quen;
  const baseHeal = 40
  const totalHeal = parseInt(baseHeal * quenIntensity);
  const effectData = effectsData["defense_up"];

  
  const action = {
    healedWith: "Quen Sign",
    healPoints: parseInt(totalHeal),
    attacker: "player",
    defender: null,
    effectApplied: null,
  }

  return {
    heal: totalHeal,
    isDefenseUp: isDefenseUp ? { id: effectData.id, duration: effectData.duration } : null,
    generatedLog: generateLogText(player, monster, action, battleState)
  }
};


export const isAlive = (user) => {
  return user.vitality > 0;
};

export const updateDuration = (effects, effectId, durationToAdd) =>
  (effects || []).map((effect) =>
    effect.id === effectId
      ? {
          ...effect,
          duration: effect.duration + durationToAdd,
        }
      : effect
);

export const updateBuffs = (target, battleState, setBattleState, effectId) => {
  const targetDebuffs = target === "player" ? battleState.playerDebuffs : battleState.monsterDebuffs;
  const targetDebuffsKey = target === "player" ? "playerDebuffs" : "monsterDebuffs";
  const effectData = effectId ? effectsData[effectId] : null;

  if (effectData && !checkIfEffectExists(targetDebuffs, effectId)) {
    setBattleState((prev) => ({
      ...prev,
      [targetDebuffsKey]: [...prev[targetDebuffsKey], { id: effectData.id, duration: effectData.duration}]
    }))
  } else if (effectData && existsAndCanStack(targetDebuffs, effectId)) {
    setBattleState((prev) => ({
      ...prev,
      [targetDebuffsKey]: updateDuration(prev[targetDebuffsKey], effectId, effectData.duration)
    }))
  }
}


export const applyEffects = (target, battleState, setBattleState, monsterData,  player, takeDamagePlayer, takeDamageMonster, healPlayer, healMonster) => {
  const targetEffectsKey = target === "player" ? "playerDebuffs" : "monsterDebuffs";
  const targetEffects = battleState[targetEffectsKey];

  console.log(targetEffects);
  if (!targetEffects || targetEffects.length === 0) return;

  const targetMaxVitality = target === "player" ? player.vitality : monsterData.vitality;

  let totalTickDamage = 0;
  let totalTickHeal = 0;

  const updatedEffects = targetEffects.map((effect) => {
    const effectId = effect.id;
    const effectData = effectsData[effectId];

    const isDOT = effectData.type === "damageOverTime";
    const isHOT = effectData.type === "healOverTime";
    const isDefenseType = effectData.statAffected === "defense";
    
    if (isDOT) {
      totalTickDamage += Math.round(targetMaxVitality * (effectData.tickDamagePercent || 0));;
    }

    if (isHOT) {
      totalTickHeal += Math.round(targetMaxVitality * (effectData.tickHealPercent || 0));
    }
    
    return { ...effect, duration: effect.duration - 1};
  }).filter((effect) => effect.duration > 0);

  if (totalTickDamage > 0) {
    target === "player" ? takeDamagePlayer(totalTickDamage) : takeDamageMonster(totalTickDamage);
  };

  if (totalTickHeal > 0) {
    target === "player" ? healPlayer(totalTickHeal) : healMonster(totalTickHeal);
  };

  setBattleState((prev) => ({
    ...prev,
    [targetEffectsKey]: updatedEffects
  }));

}