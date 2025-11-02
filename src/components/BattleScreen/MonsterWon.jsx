import React from "react";
import monstersData from "../../data/monster.json";

const MonsterWon = ({ monsterId }) => {
  const monsterData = monstersData[monsterId];
  return (
    <div className="h-full border">
      <h3 className="witcher-font">{monsterData.name} this battle</h3>
    </div>
  );
};

export default MonsterWon;
