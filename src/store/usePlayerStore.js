import { create } from "zustand";
import { persist } from "zustand/middleware";
import initialShopsData from "../data/shops.json";
import {
  updateItemsInInventory,
  checkIfEquipped,
  getInventoryKey,
} from "../utils/utils";
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

  // console.log({equippedArmor, equippedGauntlets, equippedTrousers, equippedBoots})

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
      isCharacterCreated: false,
      name: "Geralt",
      level: 1,
      currentExp: 0,
      expToNextLevel: 200,
      vitality: 500,
      maxVitality: 500,
      activeQuests: {},
      completedQuests: [],
      coins: 250,
      crit_chance: 5,
      base_attack: 15,
      base_defense: 20,
      stamina: 100,
      recipesUnlocked: [
        "hanged_mans_venom",
        "hybrid_oil",
        "necrophage_oil",
        "swallow",
        "steel_ingot",
        "silver_ingot",
        "iron_ingot",
      ],
      discoveredMonsters: [],

      stats: {
        totalCoins: 250,
        totalSpending: 0,
        monsterDefeated: {
          human: 0,
          nonHuman: 0,
        },
        monstersBasedStats: {},
        totalDeaths: 0,
        activeQuests: 0,
        completedQuests: 0,
      },

      inventory: {
        steelSwords: [
          { id: "witchers_steel_sword", type: "steelSwords", qty: 1 },
        ],
        silverSwords: [
          { id: "witchers_silver_sword", type: "silverSwords", qty: 1 },
        ],
        armors: [{ id: "kaer_morhen_armor", type: "armor", qty: 1 }],
        gauntlets: [{ id: "hunting_gauntlets", type: "armor", qty: 1 }],
        trousers: [{ id: "hunting_trousers", type: "armor", qty: 1 }],
        boots: [{ id: "hunting_boots", type: "armor", qty: 1 }],
        potions: [{ id: "swallow", type: "potions", qty: 3 }],
        oils: [],
        resources: [],
        foods: [
          { id: "water", type: "foods", qty: 5 },
          { id: "bread", type: "foods", qty: 3 },
          { id: "raw_meat", type: "foods", qty: 2 },
        ],
      },

      equipment: {
        steel_sword: "witchers_steel_sword",
        silver_sword: "witchers_silver_sword",
        armor: "kaer_morhen_armor",
        gauntlets: "hunting_gauntlets",
        trousers: "hunting_trousers",
        boots: "hunting_boots",
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

      createCharacter: (name, school) =>
        set((state) => {
          const baseTrait = {
            name,
            school,
            isCharacterCreated: true,
          };

          switch (school) {
            case "wolf":
              return {
                ...baseTrait,
                base_attack: Math.round(state.base_attack * 1.05),
                base_defense: Math.round(state.base_defense * 1.05),
                crit_chance: Math.round(state.crit_chance + 5),
                discoveredMonsters: ["wolf"],
                signsIntensity: {
                  ...state.signsIntensity,
                  igni: state.signsIntensity.igni * 1.05,
                  quen: state.signsIntensity.quen * 1.05,
                  yrden: state.signsIntensity.yrden * 1.05,
                  aard: state.signsIntensity.aard * 1.05,
                  axii: state.signsIntensity.axii * 1.05,
                },
              };

            case "cat":
              return {
                ...baseTrait,
                crit_chance: Math.round(state.crit_chance + 15),
                base_defense: Math.round(state.base_defense * 0.9),
                discoveredMonsters: ["bandit", "witch_hunter", "mage_hunter"],
              };

            case "griffin":
              return {
                ...baseTrait,
                signsIntensity: {
                  ...state.signsIntensity,
                  igni: state.signsIntensity.igni * 1.2,
                  quen: state.signsIntensity.quen * 1.2,
                  yrden: state.signsIntensity.yrden * 1.2,
                  aard: state.signsIntensity.aard * 1.2,
                  axii: state.signsIntensity.axii * 1.2,
                },
                discoveredMonsters: ["griffin"],
              };

            case "bear":
              return {
                ...baseTrait,
                base_defense: state.base_defense * 1.3,
                maxVitality: state.maxVitality * 1.2,
                vitality: state.vitality * 1.2,
                discoveredMonsters: ["bear"],
              };

            default:
              return baseTrait;
          }
        }),

      setPlayer: (updater) =>
        set((state) => {
          return typeof updater === "function" ? updater(state) : updater;
        }),

      meditate: () =>
        set((state) => {
          const restockedShops = structuredClone(initialShopsData);

          Object.keys(state.shops).forEach((shopId) => {
            const currentInventory = state.shops[shopId].inventory || [];
            const restockedInventory = restockedShops[shopId].inventory || [];

            currentInventory.forEach((currItem) => {
              const idx = restockedInventory.findIndex(
                (item) => item.id === currItem.id,
              );

              if (idx === -1) {
                restockedInventory.push(currItem);
              } else {
                restockedInventory[idx].qty = Math.max(
                  currItem.qty,
                  restockedInventory[idx].qty,
                );
              }
            });

            restockedShops[shopId].gold =
              restockedShops[shopId].gold + initialShopsData[shopId].gold;
          });

          return {
            vitality: state.maxVitality,
            shops: restockedShops,
          };
        }),

      craftItem: (recipeData) => {
        const { consumeItem, addToInventory } = get();

        recipeData.ingredients.forEach((ingredient) => {
          const ingredientData = itemsData[ingredient.type][ingredient.id];
          consumeItem(ingredientData, ingredient.qty);
        });

        addToInventory(
          recipeData.yields.id,
          recipeData.yields.qty,
          recipeData.subType,
        );
      },

      discoverMonster: (id) =>
        set((state) => {
          if (state.discoveredMonsters.includes(id)) return state;

          return {
            discoveredMonsters: [...state.discoveredMonsters, id],
          };
        }),

      changeLocation: (currentLocation, subLocation) =>
        set((state) => ({
          currentLocation,
          subLocation,
        })),

      unlockRecipes: (recipeIds) =>
        set((state) => ({
          recipesUnlocked: [
            ...new Set([...state.recipesUnlocked, ...recipeIds]),
          ],
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
          stats: {
            ...state.stats,
            totalCoins: state.stats.totalCoins + amount,
          },
        })),

      spendCoins: (amount) =>
        set((state) => {
          if (amount > state.coins) return state;
          return {
            coins: state.coins - amount,
            stats: {
              ...state.stats,
              totalSpending: state.stats.totalSpending + amount,
            },
          };
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

      consumeItem: (itemData, qty) =>
        set((state) => {
          const inventoryType = getInventoryKey(itemData);
          console.log(inventoryType);
          if (!state.inventory[inventoryType]) return state;

          const validateItem = state.inventory[inventoryType].some(
            (item) => item.id === itemData.id && item.qty >= qty,
          );
          if (!validateItem) return state;

          return {
            inventory: {
              ...state.inventory,
              [inventoryType]: updateItemsInInventory(
                state.inventory[inventoryType],
                itemData.id,
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
          food: "foods",
        };

        const potionData = itemsData[typeMap[type]][id];
        if (!potionData || !potionData.heal) return false;

        const healPoints = potionData.heal;

        get().heal(healPoints);
        get().consumeItem(potionData, 1);

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
              console.log(`new item: ${(itemId, qty, itemCategory)}`);
              return { ...item, qty: item.qty + qty };
            }
            return item;
          });

          if (!itemFound) {
            newList.push({ id: itemId, qty: qty, type: itemCategory });
            console.log(`new item: ${(itemId, qty, itemCategory)}`);
          }

          return {
            inventory: {
              ...state.inventory,
              [itemCategory]: newList,
            },
          };
        }),

      updateMonsterStats: (monsterId, isMonster) =>
        set((state) => {
          const monsterTypeKey = (isMonster || ["wolf", "bear"].includes(monsterId)) ? "nonHuman" : "human";
          const monsterKillCount = state.stats.monstersBasedStats[monsterId] || 0;

          return {
            stats: {
              ...state.stats,
            monsterDefeated: {
              ...state.stats.monsterDefeated,
              [monsterTypeKey]: state.stats.monsterDefeated[monsterTypeKey] + 1
            },

            monstersBasedStats: {
              ...state.stats.monstersBasedStats,
              [monsterId]: monsterKillCount + 1
            }
            }
          }
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
            [questId]: {
              status: "active",
              progress: 0,
              required: contractData.target_qty,
              monsterId: contractData.target_monster,
            },
          };

          return { activeQuests: updatedQuests };
        }),

      updateQuests: (monsterId) =>
        set((state) => {
          const currentActiveQuests = { ...state.activeQuests };
          let madeProgress = false;
          console.log(monsterId);

          Object.entries(currentActiveQuests).forEach(
            ([questId, questData]) => {
              if (
                questData.monsterId === monsterId &&
                questData.progress < questData.required
              ) {
                const newProgress = questData.progress + 1;

                currentActiveQuests[questId] = {
                  ...questData,
                  progress: newProgress,
                  status:
                    newProgress >= questData.required ? "completed" : "active",
                };

                madeProgress = true;
              }
            },
          );

          if (!madeProgress) return state;

          return { activeQuests: currentActiveQuests };
        }),

      turnInQuest: (contractId) => {
        const {
          activeQuests,
          addCoins,
          updateLevelExp,
          completeQuest,
          unlockRecipes,
        } = get();
        if (!(contractId in activeQuests)) return;

        const contractData = contractsData[contractId];
        if (contractData.reward_recipe) {
          unlockRecipes(contractData.reward_recipe);
        }
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
      partialize: (state) => {
        const { inBattle, ...stateToSave } = state;
        return stateToSave;
      },
    },
  ),
);

export const usePlayer = () => {
  const rawPlayerStats = usePlayerStore((state) => state);
  const calculatedPlayerStats = calculateDerivedStats(rawPlayerStats);
  return calculatedPlayerStats;
};
