import monstersData from "../data/monster.json";

export const randomInRange = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const playerSilverDamage = (player, monsterWeakness, appliedOil = null) => {

    const minDamage = player.attack?.silverAttack[0];
    const maxDamage = player.attack?.silverAttack[1];
    const damage = randomInRange(minDamage, maxDamage);

    const oilMultiplier = 1.5;
    const critChance = player.crit_chance;
    const critMultiplier = 2;
    const isCrit = Math.random() < critChance / 100;


    let playerAttackDmg = 0;

    if (isCrit) {
        playerAttackDmg += damage*critMultiplier;
    } else {
        playerAttackDmg += damage;
    }

    if (appliedOil && monsterWeakness.includes(appliedOil)) {
        playerAttackDmg *= oilMultiplier;
    };

    console.log(`${player.name} attacked for ${playerAttackDmg} ${appliedOil ? `with ${appliedOil}` : ""} ${isCrit ? "(CRIT!)" : ""}`)
    return playerAttackDmg;
};


export const monsterDamage = (monsterId, playerDefense) => {
    const monster = monstersData[monsterId];

    const isCrit = Math.random() < monster.crit_chance / 100;
    const damage = randomInRange(monster.attack[0], monster.attack[1]);
    
    const critMultiplier = 2;
    const defenseMultiplier = 100/(playerDefense+100);

    let monsterAttackDmg = Math.max(0, isCrit ? (damage*critMultiplier)*defenseMultiplier : damage*defenseMultiplier);

    console.log(`${monster.name} attacked for ${monsterAttackDmg.toFixed(2)} ${isCrit ? "(CRIT!)" : ""}`);
    return monsterAttackDmg;

};

export const generateLoot = (monsterDrops) => {
    let loot = [];

    monsterDrops.forEach(drop => {
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


export const isAlive = (user) => {
    return user.vitality > 0;
}