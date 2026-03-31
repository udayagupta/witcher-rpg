import React from 'react'
import { usePlayer, usePlayerStore } from '../../store/usePlayerStore';
import monsters from "../../data/monster.json";
import StatsTable from './StatsTable';

const PlayerStats = () => {
  const player = usePlayer();
  const playerStats = usePlayerStore((state) => state.stats);

  // const basicStats =
  //   [
  //     { key: "totalCoins", name: "Total Coins Collected" },
  //     { key: "totalSpending", name: "Total Coins Spending" },
  //     { key: "totalDeaths", name: "Total Deaths" },
  //     { key: "activeQuests", name: "Total Active Contracts" },
  //     { key: "completedQuests", name: "Total Completed Contracts" }
  //   ]

  // const monsterTypeKillings = [
  //   { key: "human", name: "Human Kills" },
  //   { key: "nonHuman", name: "Non-Human Kills" }
  // ]

  const basicStatsTable = {
    caption: "Basic Stats",
    theads: ["Stat", "Total"],
    trows: [
      { name: "Total Coins Collected", value: playerStats.totalCoins },
      { name: "Total Coins Spent", value: playerStats.totalSpending },
      { name: "Total Deaths", value: playerStats.totalDeaths },
      { name: "Total Active Contracts", value: Object.keys(player.activeQuests).length || 0 },
      { name: "Total Completed Contracts", value: player.completedQuests?.length || 0 }
    ]
  };

  const monsterTypeTable = {
    caption: "Monster Type Killings",
    theads: ["Type", "Kills"],
    trows: [
      { name: "Human Kills", value: playerStats.monsterDefeated.human },
      { name: "Non-Human Kills", value: playerStats.monsterDefeated.nonHuman }
    ]
  };

  const monsterBasedTable = {
    caption: "Monster Based Killings",
    theads: ["Monster", "Kills"],
    trows: Object.entries(playerStats.monstersBasedStats).map(([monsterId, killCount]) => ({
      name: monsters[monsterId]?.name || monsterId,
      value: killCount,
      monsterId: monsterId
    }))
  };

  return (
    <div className=''>
      <div className='witcher-font text-amber-300 text-3xl'>
        <h3>{player.name} Stats</h3>
      </div>

      <div className='flex flex-col gap-5'>
        <StatsTable tableObject={basicStatsTable}/>
        <StatsTable tableObject={monsterTypeTable}/>
        <StatsTable tableObject={monsterBasedTable} isMonsterBased={true}/>
      </div>
      
    </div>
  )
}

export default PlayerStats