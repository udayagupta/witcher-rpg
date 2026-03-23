import { create } from "zustand";
import { persist } from "zustand";
import initialShopsData from "../data/shops.json";

export const usePlayerStore = create(
  persist((set, get) => ({
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

    shops: initialShopsData
    
  })),
);
