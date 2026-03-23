import { create } from "zustand";
import { persist } from "zustand";
import initialShopsData from "../data/shops.json";
import { updateItemsInInventory, checkIfEquipped } from "../utils/utils";
import itemsData from "../data/items.json";

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

        const potionData = itemsData[type + "s"][id];
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

          let newList = currentCategoryList.map((item) => {
            if (item.id === itemId) {
              itemFound = true;
              return { ...item, qty: state.qty + qty };
            }
            return item;
          });

          if (!itemFound) {
            newList.push({ id: itemId, type: itemCategory, qty: qty });
          }

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

          const updatedQuests = {
            ...state.activeQuests,
            [questId]: { status: "active", progress: 0 },
          };

          return { activeQuests: updatedQuests };
        }),

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
