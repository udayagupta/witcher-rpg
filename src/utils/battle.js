import { effectsData } from "./effects";

const SIGN_WEAKNESS_MULTIPLIER = 2;
const SILVER_ATTACK_MULTIPLIER = 1.5;
const STEEL_ATTACK_MULTIPLIER = 1.5;

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


export const monsterDamage = (monster, playerDefense) => {
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
  return {
    monsterAttackDmg,
    log: `${monster.name} attacked for ${parseInt(monsterAttackDmg)} damage ${isCrit ? "(CRIT💥)" : ""} 
    ${
      isBuff && monsterBuffs
        ? `and inflicted ${effectData.name} for ${effectData.duration} turns`
        : ""
    }.`,
    buff: isBuff && monsterBuffs ? { id: monsterBuffs, duration: effectData.duration } : null,
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

export const handleIgni = (burnChance = 0.1, player, monster, battleState) => {
  const isBurning = Math.random() < burnChance;
  const effectId = "burn"
  const igniIntensity = player.signsIntensity.igni;
  const monsterWeakness = monster.weakness.signs;
  const baseDamage = 40;
  const totalDamage = monsterWeakness.includes("Igni") ? baseDamage*igniIntensity*SIGN_WEAKNESS_MULTIPLIER : baseDamage*igniIntensity;
  const effectData = effectsData[effectId];
  const log = () => { 
    let text = `${player.name} used Igni${effectData.icon} and dealt ${totalDamage} ${effectData.damageType} damage`;
    const effectExistsAndCanStack = existsAndCanStack(battleState.monsterDebuffs, effectId);
    const effectOnlyExsists = checkIfEffectExists(battleState.monsterDebuffs, effectId);

    if (isBurning && effectOnlyExsists && !effectExistsAndCanStack) {
      text += ` and ${player.name} tried burning the ${monster.name} but failed as it was already on fire!.` 
    }
    if ((isBurning && effectExistsAndCanStack) || (isBurning && !effectOnlyExsists)) {
      text += ` and for ${effectData.duration} turns, ${effectData.applyLog(monster.name)}`
    }

    return text;
  }

  return {
    damage: parseInt(totalDamage),
    isBurning: isBurning ? { id: effectData.id, duration: effectData.duration } : null,
    log: log(),
  }

};
export const handleYrden = () => {

};
export const handleAard = () => {};

export const handleQuen = (defenseUpChance = 0.05, player, monster) => {
  const isDefenseUp = Math.random() < defenseUpChance;
  const quenIntensity = player.signsIntensity.quen;
  const baseHeal = 40
  const totalHeal = parseInt(baseHeal * quenIntensity);
  const effectData = effectsData["defense_up"];

  return {
    heal: totalHeal,
    isDefenseUp: isDefenseUp ? { id: effectData.id, duration: effectData.duration } : null,
    log: `${player.name} use Quen and healed ${totalHeal} vitality ${isDefenseUp ? `and for ${effectData.duration} turns, ${effectData.applyLog(player.name)}` : ""}`
  }
};
export const handleAxii = () => {};

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

export const checkIfEffectExists = (debuffs = [], effectId) => {
  const exists = debuffs.find((effect) => effect.id === effectId);

  return exists ? true : false;
};

export const existsAndCanStack = (effects, effectId) => {
  const effectData = effectsData[effectId];
  return (checkIfEffectExists(effects, effectId) && effectData.canStack); 
}

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


  battleState[targetEffectsKey].map((buff, _) => {
    const effectData = effectsData[buff.id];
    if (effectData.type === "damageOverTime") {
      if (target === "player") {
        takeDamagePlayer(player.vitality * effectData.tickDamagePercent);
        setBattleState((prev) => ({
          ...prev,
          playerDebuffs: updateDuration(prev.playerDebuffs, effectData.id, -1)
        }))
      } else {
        console.log(monsterData.vitality * effectData.tickDamagePercent);
        takeDamageMonster(monsterData.vitality * effectData.tickDamagePercent);
        setBattleState((prev) => ({
          ...prev,
          monsterDebuffs: updateDuration(prev.monsterDebuffs, effectData.id, -1)
        }))
      }
    }

    if (effectData.type === "healOverTime") {
      if (target === "player") {
        healPlayer(parseInt(player.vitality * effectData.tickHealPercent));
        setBattleState((prev) => ({
          ...prev,
          playerDebuffs: updateDuration(prev.playerDebuffs, effectData.id, -1)
        }))
      } else {
        healMonster(parseInt(monsterDamage.vitality * effectData.tickHealPercent));
        setBattleState((prev) => ({
          ...prev,
          monsterDebuffs: updateDuration(prev.monsterDebuffs, effectData.id, -1)
        }))
      }
    }

  })

  setBattleState((prev) => ({
    ...prev,
    monsterDebuffs: prev.monsterDebuffs.filter(debuff => debuff.duration > 0),
    playerDebuffs: prev.playerDebuffs.filter(debuff => debuff.duration > 0)
  }));

}