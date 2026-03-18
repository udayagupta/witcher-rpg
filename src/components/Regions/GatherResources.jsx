import React from 'react'

const GatherResources = ({ subLocationData, itemsData }) => {
  return (
    <div className="gather-resources">
      <h4 className="text-amber-300 text-2xl witcher-font">
        Gather Resources
      </h4>
      {subLocationData["resources_to_gather"] ? (
        <ul className="flex flex-wrap gap-4 justify-center items-center mt-4 p-2">
          {subLocationData["resources_to_gather"]?.map((item) => {

            const itemName = itemsData?.resources[item]?.name || itemsData?.foods[item]?.name || item;

            return (
              <li
                key={item}
                className="group flex flex-col items-center justify-between w-35 h-32 cursor-pointer  p-3 bg-neutral-900/80 border border-neutral-700 rounded-lg shadow-md hover:border-amber-300 transition-all duration-300"
                title={`Gather ${itemName}`}
              >
                <div className="">
                  <img
                    src={`./images/items/${item}.png`}
                    alt={itemName}
                    className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-md  font-semibold text-neutral-300 text-center tracking-wide group-hover:text-amber-300 transition-colors leading-tight mt-2">
                  {itemName}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xl">
          No resources to gather, try going somewhere else.
        </p>
      )}
    </div>
  )
}

export default GatherResources