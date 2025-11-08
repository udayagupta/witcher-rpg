import React from 'react'
import { generateLoot } from '../../utils/battle';

const BattleResultPopUp = ({ monsterData, battleResult, handleClose }) => {
  const isVictory = battleResult === "player";
  const lootGenerated = generateLoot(monsterData.drops);
  let xpGained;

  return (
    <div className='fixed inset-0 bg-neutral-800 border border-amber-300 bg-opacity-70 flex items-center justify-center z-50'>
      <div>
        <h3 className='witcher-font heading'>
          {isVictory ? `Victory!` : `Defeat`}
        </h3>

        {
          isVictory ? (
            <>
              <p>You have defeated the {monsterData.name}</p>
              <p></p>
            </>
          ) : (
            <p>
              You were defeated by {monsterData.name}. Try again!
            </p>
          )
        }
      </div>
    </div>
  )
}

export default BattleResultPopUp