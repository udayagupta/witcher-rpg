import { useContext, useState, createContext, useEffect } from "react";
import itemsData from "../../data/items.json";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState({
    name: "Geralt",
    fullName: "Geralt of Rivia",
    level: 1,
    currentExp: 0,
    vitality: 500,
    maxVitality: 500,
    completedQuests: [],
    activeQuests: [],
    coins: 1200,
    crit_chance: 5,
    base_attack: 15,
    base_defense: 20,
    stamina: 100,

    inventory: {
      steelSwords: [{ id: "steel_sword_basic", qty: 1 }],
      silverSwords: [{ id: "silver_sword_basic", qty: 1 }],
      armor: [{ id: "viper_basic_armor", qty: 1 }],
      gauntlets: [{ id: "viper_basic_gauntlets", qty: 1 }],
      trousers: [{ id: "viper_basic_trousers", qty: 1 }],
      boots: [{ id: "viper_basic_boots", qty: 1 }],
      potions: [],
      oils: [],
      resources: [],
      food: [],
    },

    equipment: {
      steel_sword: "steel_sword_basic",
      silver_sword: "silver_sword_basic",
      armor: "viper_basic_armor",
      gauntlets: "viper_basic_gauntlets",
      trousers: "viper_basic_trousers",
      boots: "viper_basic_boots",
    },

    currentLocation: "white_orchard",
    subLocation: "orchard_fields",
    inBattle: false,
    isTraveling: false,

    signsIntensity: {
      igni: 1,
      quen: 1,
      yrden: 1,
      axii: 1,
      aard: 1
    }
  });

  const heal = (amount) => {
    setPlayer((prev) => ({
      ...prev,
      vitality: Math.min(prev.vitality + amount, prev.maxVitality),
    }));
  };

  const takeDamage = (amount) => {
    setPlayer((prev) => ({
      ...prev,
      vitality: Math.max(prev.vitality - amount, 0),
    }));
  };

  const addCoins = (amount) => {
    setPlayer((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const usedASign = (staminaReq) => {
    setPlayer((prev) => ({...prev, stamina: Math.max(0, prev.stamina - staminaReq)}));
  }

  const spendCoins = (amount) => {
    if (amount > player.coins) return false;
    setPlayer((prev) => ({ ...prev, coins: prev.coins - amount }));
  };

  const completeQuest = (questId) => {
    setPlayer((prev) => ({
      ...prev,
      completedQuests: [...prev.completedQuests, questId],
      activeQuests: prev.activeQuests.filter((q) => q !== questId),
    }));
  };

  const acceptContract = (questId) => {
    if (player.activeQuests.includes(questId)) return;

    setPlayer((prev) => ({
      ...prev,
      activeQuests: [...prev.activeQuests, questId],
    }));
  };

  const addToInventory = (itemId, qty, itemCategory) => {
    // {  }
  };

  const resetVitality = () => {
    setPlayer((prev) => ({
      ...prev,
      vitality: prev.maxVitality,
    }));
  };

  const increaseStamina = (amount) => {
    setPlayer((prev) => ({
      ...prev,
      stamina: Math.min(100, prev.stamina+amount)
    }))
  }

  const value = {
    player,
    setPlayer,
    heal,
    addCoins,
    spendCoins,
    addToInventory,
    completeQuest,
    acceptContract,
    takeDamage,
    resetVitality,
    usedASign,
    increaseStamina,
  };

  const reflectEquippedEquipment = (player) => {
    const equippedSteelSword = player.equipment.steel_sword
      ? itemsData["steel_swords"][player.equipment.steel_sword]
      : null;
    const equippedSilverSword = player.equipment.silver_sword
      ? itemsData["silver_swords"][player.equipment.silver_sword]
      : null;

    const equippedArmor = player.equipment.armor
      ? itemsData["armor"][player.equipment.armor]
      : null;
    const equippedGauntlets = player.equipment.gauntlets
      ? itemsData["armor"][player.equipment.gauntlets]
      : null;
    const equippedTrousers = player.equipment.trousers
      ? itemsData["armor"][player.equipment.trousers]
      : null;
    const equippedBoots = player.equipment.boots
      ? itemsData["armor"][player.equipment.boots]
      : null;

    const totalDefense =
      player.base_defense +
      (equippedArmor ? equippedArmor.defense : 0) +
      (equippedGauntlets ? equippedGauntlets.defense : 0) +
      (equippedTrousers ? equippedTrousers.defense : 0) +
      (equippedBoots ? equippedBoots.defense : 0);

    const steelSwordAttack = [
      player.base_attack +
        (equippedSteelSword ? equippedSteelSword.attack[0] : 0),
      equippedSteelSword
        ? player.base_attack + equippedSteelSword.attack[1]
        : player.base_attack,
    ];
    const silverSwordAttack = [
      player.base_attack +
        (equippedSilverSword ? equippedSilverSword.attack[0] : 0),
      equippedSilverSword
        ? player.base_attack + equippedSilverSword.attack[1]
        : player.base_attack,
    ];

    return {
      ...player,
      defense: totalDefense,
      attack: {
        steelAttack: steelSwordAttack,
        silverAttack: silverSwordAttack,
      },
    };
  };

  useEffect(() => {
    const updatedPlayer = reflectEquippedEquipment(player);
    setPlayer((prev) => ({ ...updatedPlayer }));
  }, [player.equipment]);

  useEffect(() => {
    // monsterDamage("devil-by-the-well", player.defense);
    // monsterDamage("griffin", player.defense);
    // monsterDamage("drowner", player.defense);
    // monsterDamage("siren", player.defense);
    // monsterDamage("leshen", player.defense);
    // monsterDamage("nekker", player.defense);
    // monsterDamage("wyvern", player.defense);
    // generateLoot([{ "id": "hybrid_oil", "chance": 0.35 }, { "id": "swallow", "chance": 0.25 }])
    // generateLoot([{ "id": "necrophage_oil", "chance": 0.25 }, { "id": "swallow_strong", "chance": 0.15 }])
  });

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
