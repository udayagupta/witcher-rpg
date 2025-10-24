import React, { useState } from "react";
import monstersData from "../data/monster.json";
import { useScroll } from "motion/react";

const MonsterBestiary = () => {
  const [selectedMonster, setSelectedMonster] = useState("");

  const SelectedMonsterCard = () => {
    if (!selectedMonster) {
      return (
        <div className="flex flex-col justify-center text-lg items-center h-full text-slate-400">
          <p>Select a contract to view details.</p>
        </div>
      );
    }

    const selectedMonsterData = monstersData[selectedMonster];

    return (
      <div>
        <img src={`./images/${selectedMonster}.png`} alt="" />
        <p className="witcher-font text-3xl text-orange-400">
          {selectedMonsterData.name}
        </p>
        <p className="p-3 playwrite-font">{selectedMonsterData.bestiary_entry}</p>
        <p className="p-3">
          Weakness: {selectedMonsterData.weakness.join(", ")}
        </p>
      </div>
    );
  };

  return (
    <div className="flex pt-sans-font gap-5">
      <div className="w-[65%] h-[500px] overflow-auto">
        <ul className="border gap-5 p-4 monster-list">
          {Object.keys(monstersData).map((key, index) => (
            <li
              onClick={() => setSelectedMonster(key)}
              key={index}
              className={`${
                key === selectedMonster ? "text-orange-400" : ""
              }  max-h-max flex flex-col overflow-hidden transition duration-300 cursor-pointer border-2 border-slate-800 rounded-md hover:text-orange-400 hover:border-orange-400`}
            >
              <p className="bg-slate-800 p-2 witcher-font">{monstersData[key].name}</p>
              <img
                src={`./images/${key}.png`}
                className=""
                alt={monstersData[key].name}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="selected-monster h-[500px] overflow-auto w-[35%] border">
        <SelectedMonsterCard />
      </div>
    </div>
  );
};

export default MonsterBestiary;
