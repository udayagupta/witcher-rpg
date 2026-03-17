import React from 'react'

const MonsterHunting = ({props}) => {
  return (
    <div className="monster-hunting">
      <h4 className="text-amber-300 text-2xl witcher-font">
        Monster Hunting
      </h4>
      {props.subLocationData["monsters_found"] ? (
        <ul className="flex gap-5 justify-center p-2">
          {props.subLocationData["monsters_found"]?.map((monster) => (
            <li
              key={monster}
              className="items-list-item items-list-item-not-selected w-[193px] h-[254px] hover:text-amber-300"
              onClick={() => {
                props.setSelectedMonster(monster);
                props.setGameMode("battle");
                props.setPlayer(prev => ({ ...prev, inBattle: true }))
              }}
            >
              <p className="witcher-font font-semibold">
                {props.monsterData[monster].name}
              </p>
              <img
                src={`./images/${monster}.png`}
                className="w-full object-contain "
                alt=""
              />
              <p className="witcher-font">💀 {props.monsterData[monster].difficulty}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xl">
          No mounsters to hunt, try going somewhere else.
        </p>
      )}
    </div>
  )
}

export default MonsterHunting;