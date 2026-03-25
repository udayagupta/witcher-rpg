import { create } from "zustand";
import { persist } from "zustand/middleware";
import initialShopsData from "../data/shops.json";
import { updateItemsInInventory, checkIfEquipped } from "../utils/utils";
import itemsData from "../data/items.json";
import contractsData from "../data/contracts.json";

const calculateDerivedStats = (player) => {
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

  return {
    ...player,
    defense: totalDefense,
    attack: {
      steelAttack: steelSwordAttack,
      silverAttack: silverSwordAttack,
    },
  };
};

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      name: "Geralt",
      fullName: "Geralt of Rivia",
      level: 1,
      currentExp: 190,
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
          { id: "gwyhyr", type: "steelSwords", qty: 1 },
        ],
        silverSwords: [
          { id: "silver_sword_basic", type: "silverSwords", qty: 1 },
          { id: "griffin_silver_sword", type: "silverSwords", qty: 1 },
          { id: "aerondight", type: "silverSwords", qty: 1 },
        ],
        armors: [
          { id: "viper_basic_armor", type: "armor", qty: 1 },
          { id: "hunters_armor", type: "armor", qty: 1 },
          { id: "griffin_armor", type: "armor", qty: 1 },
          { id: "ursine_heavy_armor", type: "armor", qty: 1 },
        ],
        gauntlets: [
          { id: "viper_basic_gauntlets", type: "armor", qty: 1 },
          { id: "griffin_gauntlets", type: "armor", qty: 1 },
        ],
        trousers: [
          { id: "viper_basic_trousers", type: "armor", qty: 1 },
          { id: "ursine_trousers", type: "armor", qty: 1 },
        ],
        boots: [{ id: "viper_basic_boots", type: "armor", qty: 1 }],
        potions: [{ id: "swallow", type: "potions", qty: 3 }],
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
          { id: "monster_saliva", type: "resources", qty: 1 },
        ],
        foods: [
          { id: "water", type: "foods", qty: 5 },
          { id: "bread", type: "foods", qty: 3 },
          { id: "raw_meat", type: "foods", qty: 2 },
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
      subLocation: "white_orchard_inn",

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

      shops: initialShopsData,

      setPlayer: (updater) => set((state) => {
        return typeof updater === "function" ? updater(state) : updater; 
      }),

      changeLocation: (currentLocation, subLocation) => 
        set((state) => ({
          currentLocation, subLocation 
        })),

      takeDamage: (amount) =>
        set((state) => ({
          vitality: Math.max(state.vitality - amount, 0),
        })),

      heal: (amount) =>
        set((state) => ({
          vitality: Math.min(state.vitality + amount, state.maxVitality),
        })),

      addCoins: (amount) =>
        set((state) => ({
          coins: state.coins + amount,
        })),

      spendCoins: (amount) =>
        set((state) => {
          if (amount > state.coins) return state;
          return { coins: state.coins + amount };
        }),

      usedASign: (staminaCost) =>
        set((state) => ({
          stamina: Math.max(0, state.stamina - staminaCost),
        })),

      resetVitality: () =>
        set((state) => ({
          vitality: state.maxVitality,
        })),

      increaseStamina: (amount) =>
        set((state) => ({
          stamina: Math.min(100, state.stamina + amount),
        })),

      consumeItem: (itemId, itemType, qty) =>
        set((state) => {
          const inventoryType = itemType + "s";
          if (!state.inventory[inventoryType]) return state;

          const validateItem = state.inventory[inventoryType].some(
            (item) => item.id === itemId && item.qty >= qty,
          );
          if (!validateItem) return state;

          return {
            inventory: {
              ...state.inventory,
              [inventoryType]: updateItemsInInventory(
                state.inventory[inventoryType],
                itemId,
                qty,
              ),
            },
          };
        }),

      consumeHealthItem: (id, type) => {
        const state = get();

        if (state.vitality === state.maxVitality) return false;

        const typeMap = {
          potion: "potions",
          food: "foods"
        }

        const potionData = itemsData[typeMap[type]][id];
        if (!potionData || !potionData.heal) return false;

        const healPoints = potionData.heal;

        get().heal(healPoints);
        get().consumeItem(id, type, 1);

        return true;
      },

      equip: (itemData) =>
        set((state) => {
          if (
            checkIfEquipped(state.equipment, itemData) ||
            state.level < itemData.level_req
          )
            return state;

          return {
            equipment: {
              ...state.equipment,
              [itemData.slot]: itemData.id,
            },
          };
        }),

      addToInventory: (itemId, qty, itemCategory) =>
        set((state) => {
          const currentCategoryList = state.inventory[itemCategory] || [];
          let itemFound = false;
          console.log({itemId, qty, itemCategory});

          let newList = currentCategoryList.map((item) => {
            if (item.id === itemId) {
              itemFound = true;
              return { ...item, qty: item.qty + qty };
            }
            return item;
          });

          if (!itemFound) {
            newList.push({ id: itemId, qty: qty, type: itemCategory});
          }

          console.log(newList);

          return {
            inventory: {
              ...state.inventory,
              [itemCategory]: newList,
            },
          };
        }),

      completeQuest: (questId) =>
        set((state) => {
          const { [questId]: removedQuest, ...remainingActiveQuests } =
            state.activeQuests;

          return {
            completedQuests: [...state.completedQuests, questId],
            activeQuests: remainingActiveQuests,
          };
        }),

      acceptContract: (questId) =>
        set((state) => {
          if (questId in state.activeQuests) return state;

          const contractData = contractsData[questId];

          const updatedQuests = {
            ...state.activeQuests,
            [questId]: { status: "active", progress: 0, required: contractData.target_qty, monsterId: contractData.target_monster },
          };

          return { activeQuests: updatedQuests };
        }),

      updateQuests: (monsterId) => set((state) => {
        const currentActiveQuests = { ...state.activeQuests };
        let madeProgress = false;
        console.log(monsterId);

        Object.entries(currentActiveQuests).forEach(([questId, questData]) => {
          if (questData.monsterId === monsterId && questData.progress < questData.required) {
            const newProgress = questData.progress + 1;

            console.log("Before Update: ", currentActiveQuests[questId]);

            currentActiveQuests[questId] = {
                ...questData,
                progress: newProgress,
                status: newProgress >= questData.required ? "completed" : "active"
              }

            madeProgress = true;

            console.log("After Update: ", currentActiveQuests[questId]);

          }
        })

        if (!madeProgress) return state;

        return { activeQuests: currentActiveQuests };

      }),

      turnInQuest: (contractId) => {
        const { activeQuests, addCoins, updateLevelExp, completeQuest } = get();
        if (!(contractId in activeQuests)) return;

        const contractData = contractsData[contractId];
        addCoins(contractData.reward_coins);
        updateLevelExp(contractData.reward_exp);
        completeQuest(contractId);
      },

      updateLevelExp: (amount) =>
        set((state) => {
          const upgradeMultiplier = 1.1;
          let currentExp = state.currentExp + amount;
          let level = state.level;
          let expToNextLevel = state.expToNextLevel;
          let base_defense = state.base_defense;
          let base_attack = state.base_attack;
          let maxVitality = state.maxVitality;
          let crit_chance = state.crit_chance;

          let didLevelUp = false;

          while (currentExp >= expToNextLevel) {
            currentExp -= expToNextLevel;
            level += 1;

            expToNextLevel = Math.round(expToNextLevel * 1.2);
            base_attack = Math.round(base_attack * upgradeMultiplier);
            base_defense = Math.round(base_defense * upgradeMultiplier);
            maxVitality = Math.round(maxVitality * upgradeMultiplier);
            crit_chance = Math.round(crit_chance * upgradeMultiplier);


            didLevelUp = true;
          }

          return {
            level,
            maxVitality,
            currentExp,
            expToNextLevel,
            base_defense,
            base_attack,
            vitality: didLevelUp ? maxVitality : state.vitality,
          };
        }),
    }),
    {
      name: "witcher-save-game",
    },
  ),
);


export const usePlayer = () => {
  const rawPlayerStats = usePlayerStore((state) => state);
  const calculatedPlayerStats = calculateDerivedStats(rawPlayerStats);
  return calculatedPlayerStats;
}