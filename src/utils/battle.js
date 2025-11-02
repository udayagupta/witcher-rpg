import { effectsData } from "./effects";

export const randomInRange = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const playerSilverDamage = (
  player,
  monsterWeakness,
  appliedOil = null
) => {
  const minDamage = player.attack?.silverAttack[0];
  const maxDamage = player.attack?.silverAttack[1];
  const damage = randomInRange(minDamage, maxDamage);

  const oilMultiplier = 1.5;
  const critChance = player.crit_chance;
  const critMultiplier = 2;
  const isCrit = Math.random() < critChance / 100;

  let playerAttackDmg = parseInt(0);

  if (isCrit) {
    playerAttackDmg += damage * critMultiplier;
  } else {
    playerAttackDmg += damage;
  }

  if (appliedOil && monsterWeakness.includes(appliedOil)) {
    playerAttackDmg *= oilMultiplier;
  }

  console.log(
    `${player.name} attacked for ${playerAttackDmg} ${
      appliedOil ? `with ${appliedOil}` : ""
    } ${isCrit ? "(CRIT!)" : ""}`
  );
  return {
    playerAttackDmg,
    log: `${player.name} dealt ${playerAttackDmg} damage ${
      appliedOil ? `, with ${appliedOil}` : ""
    } ${isCrit ? "(CRIT💥)" : ""}.`,
  };
};

export const checkIfEffectExists = (debuffs = [], effectId) => {
  const exists = debuffs.find((effect) => effect.id === effectId);

  return exists ? true : false;
};

export const updateDuration = (effects, effectId, durationToAdd) =>
  effects.map((effect) =>
    effect.id === effectId
      ? {
          ...effect,
          duration: effect.duration + durationToAdd,
        }
      : effect
  );

export const monsterDamage = (monster, playerDefense) => {
  const isCrit = Math.random() < monster.crit_chance / 100;
  const damage = randomInRange(monster.attack[0], monster.attack[1]);
  const monsterBuffs = monster.buffs.length > 0 ? monster.buffs[0] : null;
  const effectData = monsterBuffs ? effectsData[monsterBuffs] : null;
  const buffInflictingChance = 0.05;
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
  return {
    monsterAttackDmg,
    log: `${monster.name} attacked for ${parseInt(monsterAttackDmg)} damage ${
      isCrit ? "(CRIT💥)" : ""
    } ${
      isBuff && monsterBuffs
        ? `and inflicted ${effectData.name} for ${effectData.duration} turns`
        : ""
    }.`,
    buff:
      isBuff && monsterBuffs
        ? { id: monsterBuffs, duration: effectData.duration }
        : null,
  };
};

export const generateLoot = (monsterDrops) => {
  let loot = [];

  monsterDrops.forEach((drop) => {
    const chance = Math.random() < drop.chance;
    if (chance) loot.push(drop.id);
  });

  console.log(loot);

  return loot;
};
export const completeContract = (quest_location, quest_id) => {
  // include rewarding the player crowns,
  // adding generated loot to the player inventory
};

export const handleIgni = (burnChance = 0.1, player, monster) => {
  const isBurning = Math.random() < burnChance;
  const igniIntensity = player.signsIntensity.igni;
  const baseDamage = 40;
  const totalDamage = baseDamage*igniIntensity;
  const effectData = effectsData["burn"];

  return {
    damage: totalDamage,
    isBurning: isBurning ? { id: effectData.id, duration: effectData.duration } : null,
    log: `${player.name} used Igni${effectData.icon} and dealt ${totalDamage} ${effectData.damageType} damage ${isBurning ? `and for ${effectData.duration} turns, ${effectData.applyLog(monster.name)}` : ""}`
  }

};
export const handleYrden = () => {

};
export const handleAard = () => {};
export const handleQuen = () => {};
export const handleAxii = () => {};

export const isAlive = (user) => {
  return user.vitality > 0;
};
