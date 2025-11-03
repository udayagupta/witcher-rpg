import React, { useState } from "react";
import monstersData from "../data/monster.json";

const MonsterBestiary = () => {
  const [selectedMonster, setSelectedMonster] = useState("");

  const SelectedMonsterCard = () => {
    if (!selectedMonster) {
      return (
        <div className="flex flex-col justify-center text-lg items-center h-full text-neutral-300">
          <p>Select a monster to view details.</p>
        </div>
      );
    }

    const selectedMonsterData = monstersData[selectedMonster];

    return (
      <div className="flex flex-col border border-amber-300 gap-3 p-4 bg-neutral-900/30 rounded text-white">
        <img
          src={`./images/${selectedMonster}.png`}
          alt={selectedMonsterData.name}
          className="w-full object-contain"
        />
        <p className="witcher-font text-3xl text-amber-300">
          {selectedMonsterData.name}
        </p>
        <p className="p-3  text-sm opacity-90">
          {selectedMonsterData.bestiary_entry}
        </p>
        <p className="">
          <span className="opacity-80 text-sm">Weakness — Oils:</span>{" "}
          <span className="font-semibold">
            {(selectedMonsterData.weakness?.oil || []).join(", ") || "—"}
          </span>
        </p>
        <p className="">
          <span className="opacity-80 text-sm">Weakness — Signs:</span>{" "}
          <span className="font-semibold">
            {(selectedMonsterData.weakness?.signs || []).join(", ") || "—"}
          </span>
        </p>
        <p className="">
          <span className="opacity-80 text-sm">Buffs:</span>{" "}
          <span className="capitalize font-semibold">
            {(selectedMonsterData.buffs || []).join(", ") || "—"}
          </span>
        </p>
      </div>
    );
  };

  return (
    <section className="h-screen flex pt-sans-font gap-5 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg p-4">
      <div className="w-[65%] overflow-auto">
        <h3 className="text-2xl p-2 witcher-font text-amber-300">Monsters</h3>
        <ul className="gap-4 p-2 monster-list">
          {Object.keys(monstersData).map((key, index) => (
            <li
              onClick={() => setSelectedMonster(key)}
              key={index}
              className={`max-h-max flex flex-col overflow-hidden transition duration-300 cursor-pointer hover:text-amber-300 rounded ${
                key === selectedMonster
                  ? "border-2 border-amber-300 bg-neutral-900/20 text-amber-300"
                  : "border border-neutral-700 bg-neutral-900/10 hover:border-amber-300"
              }`}
            >
              <p className="p-2 witcher-font font-semibold">
                {monstersData[key].name}
              </p>
              <img
                src={`./images/${key}.png`}
                className="w-full object-contain"
                alt={monstersData[key].name}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="selected-monster overflow-auto w-[35%]">
        <SelectedMonsterCard />
      </div>
    </section>
  );
};

export default MonsterBestiary;
