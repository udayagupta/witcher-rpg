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


    let playerAttackDmg = parseInt(0);

    if (isCrit) {
        playerAttackDmg += damage*critMultiplier;
    } else {
        playerAttackDmg += damage;
    }

    if (appliedOil && monsterWeakness.includes(appliedOil)) {
        playerAttackDmg *= oilMultiplier;
    };

    console.log(`${player.name} attacked for ${playerAttackDmg} ${appliedOil ? `with ${appliedOil}` : ""} ${isCrit ? "(CRIT!)" : ""}`)
    return { playerAttackDmg, log: `You dealt ${playerAttackDmg} ${appliedOil ? `, with ${appliedOil}` : ""} ${isCrit ? "(CRIT💥)" : ""}`};
};


export const monsterDamage = (monster, playerDefense) => {

    const isCrit = Math.random() < monster.crit_chance / 100;
    const damage = randomInRange(monster.attack[0], monster.attack[1]);
    
    const critMultiplier = 2;
    const defenseMultiplier = 100/(playerDefense+100);

    let monsterAttackDmg = parseInt(Math.max(0, isCrit ? (damage*critMultiplier)*defenseMultiplier : damage*defenseMultiplier));

    return { monsterAttackDmg, log: `${monster.name} attacked for ${monsterAttackDmg.toFixed(2)} ${isCrit ? "(CRIT💥)" : ""}`};

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