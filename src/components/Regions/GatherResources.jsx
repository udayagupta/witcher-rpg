import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { generateResources } from '../../utils/utils';
import Icon from '../Icon';
import items from "../../data/items.json";

const GatherResources = ({ subLocationData, itemsData }) => {
  const SCAVENGE_TIME = 10;

  const addToInventory = usePlayerStore((state) => state.addToInventory);
  const [gatherResourcesState, setGatherResourcesState] = useState({
    cooldown: 0,
    generatedLoot: [],
    togglePopUp: false
  });

  const handleScavengeArea = () => {
    if (gatherResourcesState.cooldown > 0) return;

    setGatherResourcesState((prev) => ({
      ...prev,
      cooldown: SCAVENGE_TIME,
      togglePopUp: true,
      generatedLoot: []
    }));
  };

  const handleClose = () => { setGatherResourcesState((prev) => ({ ...prev, togglePopUp: false, cooldown: 0 })) };

  useEffect(() => {
    if (gatherResourcesState.cooldown <= 0) return;

    const timer = setInterval(() => {
      setGatherResourcesState((prev) => ({ ...prev, cooldown: prev.cooldown - 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gatherResourcesState.cooldown]);

  useEffect(() => {
    if (gatherResourcesState.cooldown === 0 && gatherResourcesState.togglePopUp && gatherResourcesState.generatedLoot.length === 0) {
      const newLoot = generateResources(subLocationData["resources_to_gather"]);
      console.log(newLoot);

      setGatherResourcesState((prev) => ({
        ...prev,
        generatedLoot: newLoot,
      }));

      newLoot.forEach((loot) => {
        addToInventory(loot.id, loot.qty, loot.type);
      })
      
    };
  }, [gatherResourcesState.cooldown, gatherResourcesState.togglePopUp])


  return (
    <div className="gather-resources w-full flex flex-col items-center ">

      {/* Centered Header */}
      <h4 className="text-amber-300 text-2xl witcher-font text-center mb-6">
        Gather Resources
      </h4>

      {subLocationData["resources_to_gather"] ? (
        <div className="flex flex-col items-center w-full">

          {/* Resource Preview List */}
          <ul className="flex flex-wrap gap-4 justify-center items-center w-full p-2 mb-8">
            {subLocationData["resources_to_gather"]?.map((item) => {
              const itemName = itemsData?.resources?.[item.id]?.name || itemsData?.foods?.[item.id]?.name || item.id;

              return (
                <li
                  key={item.id}
                  className="flex flex-col items-center justify-center w-32 h-36 p-3 bg-neutral-900/80 border border-neutral-700 rounded-lg shadow-md"
                  title={itemName}
                >
                  <div className="flex-1 w-full flex items-center justify-center p-1">
                    <img
                      src={`./images/items/${item.id}.png`}
                      alt={itemName}
                      className="w-16 h-16 object-contain drop-shadow-lg opacity-90"
                    />
                  </div>
                  <p className="text-sm font-semibold text-neutral-300 text-center tracking-wide leading-tight mt-2 w-full truncate px-1">
                    {itemName}
                  </p>
                </li>
              );
            })}
          </ul>

          <button
            onClick={handleScavengeArea}
            className="px-10 py-3 border border-amber-300 bg-neutral-800  text-amber-300 hover:text-neutral-800 hover:bg-amber-300 font-bold tracking-widest rounded  cursor-pointer transition-all duration-150 uppercase text-sm"
          >
            Scavenge Area
          </button>

        </div>
      ) : (
        <p className="text-xl text-neutral-400 mt-2 italic text-center">
          No resources to gather here. Try searching somewhere else.
        </p>
      )}
      {gatherResourcesState.togglePopUp && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2'>
          <div className='relative bg-neutral-900 border border-neutral-700 flex flex-col w-[500px] min-h-[250px] p-5 rounded-lg shadow-2xl text-white'>
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-neutral-500 hover:text-white cursor-pointer transition-colors p-1"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            {gatherResourcesState.cooldown > 0 && (
              <div className='flex flex-col justify-center flex-1 w-full max-w-sm mx-auto'>
                <p className='text-white font-bold tracking-wider mb-3 animate-pulse text-center'>
                  Scavenging the area...
                </p>

                {/* Outer Bar */}
                <div className='h-3 w-full bg-neutral-950 border border-neutral-700 rounded-full overflow-hidden shadow-inner'>
                  {/* Inner Fill */}
                  <div
                    className='h-full bg-amber-300 transition-all duration-1000 ease-linear'
                    style={{ width: `${((SCAVENGE_TIME - gatherResourcesState.cooldown) / SCAVENGE_TIME) * 100}%` }}
                  ></div>
                </div>

                <p className='text-center mt-2 text-xs text-neutral-500 font-mono'>
                  {gatherResourcesState.cooldown}s remaining
                </p>
              </div>
            )}

            {(gatherResourcesState.cooldown === 0 && gatherResourcesState.togglePopUp) && (
              <div className='flex flex-col flex-1'>
                <h5 className="text-xl text-amber-400 witcher-font border-b border-neutral-700 pb-2 mb-4 text-center">
                  Items Found
                </h5>
                <ul className="flex justify-center gap-2 overflow-y-auto items-center max-h-[200px] pr-2">
                  {gatherResourcesState.generatedLoot.length > 0 ? (
                    gatherResourcesState.generatedLoot.map((loot) => {
                      return (
                        <li key={loot.id} className="relative p-2 w-[100px] h-[100px] heading text-amber-200 card">
                          <span className="absolute top-1 right-1 text-xs font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 z-10">
                            {loot.qty === -1 ? '∞' : `x${loot.qty}`}
                          </span>
                          <Icon id={loot.id} type={loot.type} size={45} />
                          <p className="text-xs">{items[loot.type][loot.id].name}</p>
                        </li>
                      )
                    })
                  ) : (
                    <p className="text-center text-neutral-500 italic mt-4">You searched thoroughly, but found nothing of value.</p>
                  )}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

export default GatherResources;