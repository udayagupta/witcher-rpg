import React from 'react'

const GatherResources = ({ subLocationData, itemsData }) => {
  return (
    <div className="gather-resources">
      <h4 className="text-amber-300 text-2xl witcher-font">
        Gather Resources
      </h4>
      {subLocationData["resources_to_gather"] ? (
        <ul className="items-list">
          {subLocationData["resources_to_gather"]?.map((item) => (
            <li
              key={item}
              className="items-list-item items-list-item-not-selected"
            >
              {itemsData?.resources[item]?.name || itemsData?.foods[item]?.name || item}
            </li>
          ))}
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