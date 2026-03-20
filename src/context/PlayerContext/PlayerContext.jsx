import { useContext, useState, createContext, useEffect } from "react";
import itemsData from "../../data/items.json";
import { checkIfEquipped, playSound, updateItemsInInventory } from "../../utils/utils";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState({
    name: "Geralt",
    fullName: "Geralt of Rivia",
    level: 3,
    currentExp: 0,
    expToNextLevel: 200,
    vitality: 500,
    maxVitality: 500,
    activeQuests: {},
    completedQuests: [],
    coins: 1200,
    crit_chance: 5,
    base_attack: 15,
    base_defense: 20,
    stamina: 100,

   inventory: {
      steelSwords: [
        { id: "steel_sword_basic", type: "steelSwords", qty: 1 },
        { id: "novigrad_longsword", type: "steelSwords", qty: 1 },
        { id: "gwyhyr", type: "steelSwords", qty: 1 }
      ],
      silverSwords: [
        { id: "silver_sword_basic", type: "silverSwords", qty: 1 },
        { id: "griffin_silver_sword", type: "silverSwords", qty: 1 },
        { id: "aerondight", type: "silverSwords", qty: 1 }
      ],
      armors: [
        { id: "viper_basic_armor", type: "armor", qty: 1 },
        { id: "hunters_armor", type: "armor", qty: 1 },
        { id: "griffin_armor", type: "armor", qty: 1 },
        { id: "ursine_heavy_armor", type: "armor", qty: 1 }
      ],
      gauntlets: [
        { id: "viper_basic_gauntlets", type: "armor", qty: 1 },
        { id: "griffin_gauntlets", type: "armor", qty: 1 }
      ],
      trousers: [
        { id: "viper_basic_trousers", type: "armor", qty: 1 },
        { id: "ursine_trousers", type: "armor", qty: 1 }
      ],
      boots: [
        { id: "viper_basic_boots", type: "armor", qty: 1 }
      ],
      potions: [
        { id: "swallow", type: "potions", qty: 3 }
      ],
      oils: [
        { id: "hybrid_oil", type: "oils", qty: 5 },
        { id: "necrophage_oil", type: "oils", qty: 5 },
        { id: "specter_oil", type: "oils", qty: 5 },
        { id: "draconid_oil", type: "oils", qty: 5 },
      ],
      resources: [
        { id: "leather_scrap", type: "resources", qty: 10 },
        { id: "metal_scrap", type: "resources", qty: 8 },
        { id: "hide", type: "resources", qty: 2 },
        { id: "monster_saliva", type: "resources", qty: 1 }
      ],
      foods: [
        { id: "water", type: "foods", qty: 5 },
        { id: "bread", type: "foods", qty: 3 },
        { id: "raw_meat", type: "foods", qty: 2 }
      ],
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
    gameMode: "explore",

    signsIntensity: {
      igni: 1,
      quen: 1,
      yrden: 1,
      axii: 1,
      aard: 1,
    },
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
    setPlayer((prev) => ({
      ...prev,
      stamina: Math.max(0, prev.stamina - staminaReq),
    }));
  };

  const spendCoins = (amount) => {
    if (amount > player.coins) return false;
    setPlayer((prev) => ({ ...prev, coins: prev.coins - amount }));
  };

  const completeQuest = (questId) => {
    setPlayer((prev) => ({
      ...prev,
      completedQuests: [...prev.completedQuests, questId],
      activeQuests: prev.activeQuests.keys().filter((q) => q !== questId),
    }));

    playSound("quest_completed");
  };

  const acceptContract = (questId) => {
    if (questId in player.activeQuests) return;

    const updatedActiveQuests = {
      ...player.activeQuests,
      [questId]: { status: "active", progress: 0 }
    };

    setPlayer((prev) => ({
      ...prev,
      activeQuests: updatedActiveQuests,
    }));

    playSound("new_quest");

  };

  const addToInventory = (itemId, qty, itemCategory) => {
    setPlayer((prev) => {
      const currentCategoryList = prev.inventory[itemCategory] || [];
      let itemFound = false;

      let newList = currentCategoryList.map((item) => {
        if (item.id === itemId) {
          itemFound = true;
          return { ...item, type: itemCategory, qty: item.qty + qty };
        }
        return item;
      });

      if (!itemFound) {
        newList.push({ id: itemId, type: itemCategory, qty: qty });
      }

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [itemCategory]: newList,
        },
      };
    });
  };

  const affectPlayerDefense = (modifier) => {
    const intiDef = player.defense;
    setPlayer((prev) => ({
      ...prev,
      defense: prev.defense + (intiDef * modifier),
    }))

  }

  const resetVitality = () => {
    setPlayer((prev) => ({
      ...prev,
      vitality: prev.maxVitality,
    }));
  };

  const increaseStamina = (amount) => {
    setPlayer((prev) => ({
      ...prev,
      stamina: Math.min(100, prev.stamina + amount),
    }));
  };

  const levelUp = () => {
    setPlayer(prev => ({ ...prev, level: prev.level + 1, currentExp: 0, expToNextLevel: prev.expToNextLevel * 1.2 }));
    playSound("level_up");
  }

  const equip = (itemData) => {
    if (checkIfEquipped(player.equipment, itemData) || (player.level < itemData.level_req)) return false;

    setPlayer((prev) => ({
      ...prev,
      equipment: {...prev.equipment, [itemData.slot]: itemData.id}
    }));

    playSound("equip");

  }

  const consumeItem = (itemId, itemType, qty) => {
    const inventoryType = itemType + "s"
    const validateItem = player.inventory[inventoryType].some((item) => item.id === itemId && item.qty >= qty);

    if (!validateItem) return;
    
    setPlayer((prev) => ({
      ...prev,
      inventory: {...prev.inventory, [inventoryType]: updateItemsInInventory(prev.inventory[inventoryType], itemId, qty)}
    }))

    if (itemType === "potion") playSound("potion_drink");
    if (itemType === "food" && itemId === "water") playSound("drink");
    if (itemType === "food") playSound("food"); 

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
    affectPlayerDefense,
    levelUp,
    equip,
    consumeItem
  };

  const reflectEquippedEquipment = (player) => {
    const equippedSteelSword = player.equipment.steel_sword
      ? itemsData["steelSwords"][player.equipment.steel_sword]
      : null;
    const equippedSilverSword = player.equipment.silver_sword
      ? itemsData["silverSwords"][player.equipment.silver_sword]
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

    // console.log(`Steel Sword: ${steelSwordAttack[0]}-${steelSwordAttack[1]}`);
    // console.log(`Silver Sword: ${silverSwordAttack[0]}-${silverSwordAttack[1]}`);

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
    // console.log(player.equipment);
  }, [player.equipment]);

  useEffect(() => {
    console.log(player.inventory);
  }, [player.inventory]);


  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
