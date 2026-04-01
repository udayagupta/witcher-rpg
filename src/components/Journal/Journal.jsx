import React, { useState } from "react";
import { usePlayer } from "../../store/usePlayerStore";
import contracts from "../../data/contracts.json";
import CompletedContracts from "./CompletedContracts";
import ActiveContracts from "./ActiveContracts";
import PlayerStats from "./PlayerStats";

const Journal = () => {
  const player = usePlayer();
  const [activeTabId, setActiveTabId] = useState("active_contracts"); 

  const categoryBtnClass = `text-amber-300 bg-neutral-800 cursor-pointer font-extrabold p-2 rounded-md flex-1 transition hover:bg-amber-300 hover:text-neutral-800`;
  const selectedBtnClass = `bg-amber-300 text-neutral-800 cursor-pointer font-extrabold p-2 rounded-md flex-1 transition`;

  const categories = [
    { label: "Completed Contracts", id: "completed_contracts", component: <CompletedContracts completedContracts={player.completedQuests}/> },
    { label: "Active Contracts", id: "active_contracts", component: <ActiveContracts activeContracts={player.activeQuests}/> },
    { label: "Player Stats", id: "player_stats", component:  <PlayerStats />},
  ];

  const activeTab = categories.find(cat => cat.id === activeTabId);

  return (
    <div>
      <h4 className='witcher-font text-3xl text-amber-300'>Journal</h4>
      <div className='flex gap-4 mt-3'>
        {categories.map((btn) => (
          <button 
            key={btn.id} 
            className={activeTabId === btn.id ? selectedBtnClass : categoryBtnClass} 
            onClick={() => setActiveTabId(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="mt-4 relative">
        {activeTab?.component}
      </div>
    </div>
  );
};

export default Journal;
