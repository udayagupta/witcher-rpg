import { useContext, useState, createContext, useEffect } from "react";
import itemsData from "../../data/items.json";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState({
    name: "Geralt",
    fullName: "Geralt of Rivia",
    level: 1,
    vitality: 500,
    maxVitality: 500,
    completedQuests: [],
    activeQuests: [],
    coins: 500,
    crit_chance: 5,
    base_attack: 15,
    base_defense: 20,
    inventory: [
      "steel_sword_basic",
      "silver_sword_basic",
      "viper_basic_armor",
      "viper_basic_gauntlets",
      "viper_basic_trousers",
      "viper_basic_boots",
    ],
    equipment: {
      steel_sword: "steel_sword_basic",
      silver_sword: "silver_sword_basic",
      armor: "viper_basic_armor",
      gauntlets: "viper_basic_gauntlets",
      trousers: "viper_basic_trousers",
      boots: "viper_basic_boots",
    },
    currentLocation: "white_orchard",
  });

  const heal = (amount) => {
    setPlayer((prev) => ({
      ...prev,
      vitality: Math.max(prev.vitality + amount, prev.maxVitality),
    }));
  };

  const addCoins = (amount) => {
    setPlayer((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

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

  const addToInventory = (item) => {
    setPlayer((prev) => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
  };

  const value = {
    player,
    setPlayer,
    heal,
    addCoins,
    spendCoins,
    addToInventory,
    completeQuest,
    acceptContract,
  };

  const reflectEquippedEquipment = (player) => {
    const equippedSteelSword = player.equipment.steel_sword ? itemsData["steel_swords"][player.equipment.steel_sword] : null;
    const equippedSilverSword = player.equipment.silver_sword ? itemsData["silver_swords"][player.equipment.silver_sword] : null;

    const equippedArmor = player.equipment.armor ? itemsData["armor"][player.equipment.armor] : null;
    const equippedGauntlets = player.equipment.gauntlets ? itemsData["armor"][player.equipment.gauntlets] : null;
    const equippedTrousers = player.equipment.trousers ? itemsData["armor"][player.equipment.trousers] : null;
    const equippedBoots = player.equipment.boots ? itemsData["armor"][player.equipment.boots] : null;

    const totalDefense = player.base_defense + (equippedArmor ? equippedArmor.defense : 0) + (equippedGauntlets ? equippedGauntlets.defense : 0) + (equippedTrousers ? equippedTrousers.defense : 0) + (equippedBoots ? equippedBoots.defense : 0)
    
    const steelSwordAttack = [player.base_attack + (equippedSteelSword ? equippedSteelSword.attack[0] : 0), (equippedSteelSword ? equippedSteelSword.attack[0] : player.base_attack)]
    const silverSwordAttack = [player.base_attack + (equippedSilverSword ? equippedSilverSword.attack[0] : 0), (equippedSilverSword ? equippedSilverSword.attack[0] : player.base_attack)]
    
    console.log(`silver sword atk: ${silverSwordAttack}`);
    console.log(`steel sword atk: ${steelSwordAttack}`);
    
    console.log(`equippedArmor: ${equippedArmor.defense}`)
    console.log(`equippedGauntlets: ${equippedGauntlets.defense}`)
    console.log(`equippedTrousers: ${equippedTrousers.defense}`)
    console.log(`equippedBoots: ${equippedBoots.defense}`)

    console.log(`total defense: ${totalDefense}`);

    return {
      ...player,
      defense: totalDefense,
      attack: {
        steelAttack: steelSwordAttack,
        silverAttack: silverSwordAttack 
      }
    }

  }
  
  useEffect(() => {
    const updatedPlayer = reflectEquippedEquipment(player);
    setPlayer(updatedPlayer);
  }, [player.equipment]);

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
