import { effectsData } from "./effects";

const SIGN_WEAKNESS_MULTIPLIER = 2;
const SILVER_ATTACK_MULTIPLIER = 1.5;
const STEEL_ATTACK_MULTIPLIER = 1.5;

export const randomInRange = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const generateLogText = (player, monster, battleState) => {
  const LOG_TEMPLATES = {
    // PLAYER_ATTACK -> damage player's attack produced, monster player attacked
    // MONSTER_ATTACK -> damage monster's attack produced, player.name monster attacked
    // PLAYER_SIGN_CAST -> which sign
    PLAYER_ATTACK: "",
    MONSTER_ATTACK: "",
    PLAYER_SIGN_CAST: "",

    DAMAGE_DEALT: "",
    DAMAGE_RECEIVED: "",
    HEAL_RECEIVED: "",
    CRITICAL_HIT: "",

    EFFECT_APPLIED: "",
    EFFECT_STACKED: "",
    EFFECT_TICK: "",
    EFFECT_EXPIRED: "",
    EFFECT_RESISTED: "",
    OIL_APPLIED: "",
    OIL_EXPIRED: "",

    ESCAPE_ATTEMPT_SUCCESSFUL: "",
    ESCAPE_ATTEMPT_FAILED: "",
    DODGED: "",
    MISSED: "",
    STAGGER: "",
    PLAYER_SIGN_CAST_FAILED: "",

  }
}

export const playerSilverDamage = (
  player,
  monster,
  isMonster = false,
  appliedOil = null
) => {
  const minDamage = player.attack?.silverAttack[0];
  const maxDamage = player.attack?.silverAttack[1];
  const damage = randomInRange(minDamage, maxDamage);
  const monsterWeakness = monster.weakness.oil;
  const monsterDef = monster.defense;
  const defenseMultiplier = 100 / (monsterDef + 100)

  const oilMultiplier = 1.5;
  const critChance = player.crit_chance;
  const critMultiplier = 2;
  const isCrit = Math.random() < critChance / 100;

  let playerAttackDmg = parseInt(0);

  if (isCrit) {
    playerAttackDmg += damage * critMultiplier * defenseMultiplier;
  } else {
    playerAttackDmg += damage * defenseMultiplier;
  }

  if (appliedOil && appliedOil.duration > 0 && monsterWeakness.includes(appliedOil.name)) {
    playerAttackDmg *= oilMultiplier;
  }

  return {
    playerAttackDmg,
    log: `${player.name} dealt ${parseInt(playerAttackDmg)} damage ${
      appliedOil ? `, with ${appliedOil.name}` : ""
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
    if (chance) loot.push({ id: drop.id, qty: drop.qty, type: drop.type });
  });

  console.log(loot);

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
  const log = () => { 
    let text = `${player.name} used Igni${effectData.icon} and dealt ${parseInt(totalDamage)} ${effectData.damageType} damage`;
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
export const handleYrden = () => {};
export const handleAard = (player, monster) => {

  const aardIntensity = player.signsIntensity.aard;
  const monsterWeakness = monster.weakness.signs;
  const monsterDef = monster.defense;
  const defenseMultiplier = 100 / (monsterDef + 100)
  const baseDamage = 40;
  const totalDamage = parseInt(monsterWeakness.includes("Aard") ? baseDamage*aardIntensity*SIGN_WEAKNESS_MULTIPLIER*defenseMultiplier : baseDamage*aardIntensity*defenseMultiplier);

  return {
    damage: totalDamage,
    log: `${player.name} used Axii and dealt ${(totalDamage)} damage`
  }
};

export const handleAxii = (defLowChange = 0.2, player, monster) => {};

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


export const applyEffects = (target, battleState, setBattleState, monsterData,  player, takeDamagePlayer, takeDamageMonster, healPlayer, healMonster, affectMonsterDefense, affectPlayerDefense) => {
  const targetEffectsKey = target === "player" ? "playerDebuffs" : "monsterDebuffs";
  
  const targetEffects = battleState[targetEffectsKey];

  targetEffects.forEach((effect) => {
    const effectId = effect.id;
    const effectData = effectsData[effectId];

    console.log(effectData);
    const targetVitality = target === "player" ? player.vitality : monsterData.vitality;
    const targetMaxVitality = target === "player" ? player.maxVitality : monsterData.max_vitality
    const durationRemaining = effect.duration;

    const isDOT = effectData.type === "damageOverTime";
    const isDefenseType = effectData.statAffected === "defense";
    const isHOT = effectData.type === "healOverTime";

    console.log(isDefenseType);

    const tickDamage = parseInt(targetMaxVitality * effectData.tickDamagePercent || 0);
    const tickHeal = parseInt(targetMaxVitality * effectData.tickHealPercent || 0);

    const tickLog = 
      isDOT ? effectData.tickLog(target === "player" ? player.name : monsterData.name, tickDamage) :
      isHOT ? effectData.tickLog(target === "player" ? player.name : monsterData.name, tickHeal) : ""
    
    if (isDOT) {
      if (target === "player") {
        takeDamagePlayer(tickDamage);
        setBattleState((prev) => ({
          ...prev,
          playerDebuffs: updateDuration(prev.playerDebuffs, effectId, -1)
        }))
      } else {
        takeDamageMonster(tickDamage);
        setBattleState((prev) => ({
          ...prev,
          monsterDebuffs: updateDuration(prev.monsterDebuffs, effectId, -1)
        }))
      }
    }

    if (isDefenseType) {
      if (target === "player") {
        affectPlayerDefense(effectData.modifier);
        setBattleState((prev) => ({
          ...prev,
          playerDebuffs: updateDuration(prev.playerDebuffs, effectId, -1)
        }))
      } else {
        affectMonsterDefense(effectData.modifier, monsterData);
        setBattleState((prev) => ({
          ...prev,
          monsterDebuffs: updateDuration(prev.monsterDebuffs, effectId, -1)
        }))
      }
    }

    if (isHOT) {
      if (target === "player") {
        healPlayer(tickHeal);
        setBattleState((prev) => ({
          ...prev,
          playerDebuffs: updateDuration(prev.playerDebuffs, effectId, -1)
        }))
      } else {
        healMonster(tickHeal);
        setBattleState((prev) => ({
          ...prev,
          monsterDebuffs: updateDuration(prev.monsterDebuffs, effectId, -1)
        }))
      }
    }
    
    // console.log(battleState.monsterDebuffs);
  })

  setBattleState((prev) => ({
    ...prev,
    monsterDebuffs: prev.monsterDebuffs.filter(debuff => debuff.duration > 0),
    playerDebuffs: prev.playerDebuffs.filter(debuff => debuff.duration > 0)
  }));


}