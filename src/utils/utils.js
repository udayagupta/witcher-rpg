import { effectsData } from "./effects";

export function formatNumber(number, locale = "en-US", options = {}) {
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error("Error formatting number:", error);
    return number.toString();
  }
}

export const formatName = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const checkIfEffectExists = (debuffs = [], effectId) => {
  const exists = debuffs.find((effect) => effect.id === effectId);
  return exists ? true : false;
};

export const existsAndCanStack = (effects, effectId) => {
  const effectData = effectsData[effectId];
  return (checkIfEffectExists(effects, effectId) && effectData.canStack); 
}

export const generateLogText = (player, monster, action, battleState) => {
  let text = [];
  
  const attacker = action?.attacker === "player" ? player : action?.attacker === "monster" ? monster : null;
  const defender = action?.defender === "player" ? player : action?.defender === "monster" ? monster : null;
  const appliedEffectData = action?.effectApplied ? effectsData[action?.effectApplied] : null;
  const appliedEffectUserKey = action?.attacker ? "playerDebuffs" : "monsterDebuffs";

  if (attacker && action.damage) {
    const atkText = `${attacker?.name} dealt ${action?.damage} to ${defender?.name} ${action.attackedWith ? `with ${action.attackedWith}` : ""}`;
    console.log(atkText);
    text.push(atkText);
  };

  if (attacker && action.withOil) {
    const oilText = `, with ${action?.withOil?.name}`;
    console.log(oilText);
    text.push(oilText);
  };

  if (attacker && action.healPoints > 0) {
    const maxHealPoints = action.healPoints > attacker.maxVitality + action.healPoints ? 0 : action.healPoints ;

    if (attacker.vitality === attacker.maxVitality) {
      const healText = `${attacker.name} already has max vitality`
      text.push(healText);
    } else {
      const healText = `${attacker?.name} healed ${maxHealPoints} points of vitality using ${action.healedWith}.`
      text.push(healText);
    };
  };

  if (attacker && appliedEffectData && !checkIfEffectExists(battleState[appliedEffectUserKey], action.appliedEffect) ) {
    const effectText = `, ${appliedEffectData.applyLog(defender.name)}`;
    console.log(effectText);
    text.push(effectText);
  };

  if (attacker && appliedEffectData && checkIfEffectExists(battleState[appliedEffectUserKey], action.appliedEffect) && !existsAndCanStack(battleState[appliedEffectUserKey], action.appliedEffect)) {
    const effectText = `, ${attacker.name} tried applying ${appliedEffectData.name} on ${defender.name} but failed!`
    console.log(effectText);
    text.push(effectText);
  };

  if (attacker && appliedEffectData && checkIfEffectExists(battleState[appliedEffectUserKey], action.appliedEffect) && existsAndCanStack) {
    const effectText = `, ${attacker.name} applied ${appliedEffectData.name} again on ${defender.name} for more ${appliedEffectData.duration} turns`;
    console.log(effectText);
    text.push(effectText);
  }

  if (action.isCrit) {
    const critText = `(CRIT💥)`;
    text.push(critText);
  }

  return text.join(" ");

}

export const checkIfEquipped = (equipment, itemData) => {
  return equipment[itemData.slot] === itemData.id;
}

export const canBeEquipped = (playerLevel, equipment, itemData) => {
  return (playerLevel >= itemData.level_req && !checkIfEquipped(equipment, itemData)) ? "Equip" : playerLevel < itemData.level_req ? "Level Too Low!" : checkIfEquipped(equipment, itemData) ? "Already Equipped" : "Equip"
}