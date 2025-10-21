import { useContext, useState, createContext } from "react";

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
    inventory: [],
    equipment: {
      steel_sword: null,
      silver_sword: null,
      armor: null,
      trousers: null,
      boots: null,
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
  }

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
  }

  return (
    <PlayerContext.Provider value={value}>
        {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
