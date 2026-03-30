import Icon from '../Icon';
import { generateResourcesMap } from '../../utils/utils';
import locations from "../../data/locations.json";
import { Tooltip } from 'react-tooltip';

const locationMap = generateResourcesMap(locations);

const IngredientCard = ({ ingredient, ingredientData, playerQty }) => {

  const foundLocations = locationMap[ingredient.id]?.locations || [];
  const tooltipId = `tooltip-${ingredient.id}`;

  return (
    <>
      <div 
        data-tooltip-id={tooltipId}
        className='flex flex-col h-full w-full justify-between items-center text-center p-2 cursor-pointer transition-all bg-neutral-900 border border-neutral-700 hover:border-amber-600/50 rounded-md'
      >
        <div className='flex flex-1 items-center justify-center aspect-square'>
          <Icon id={ingredient.id} type={ingredient.type} size={35} />
        </div>
        
        <p className='text-sm text-neutral-300 w-full truncate my-1 px-1'>
          {ingredientData?.name}
        </p>
        
        <p className={`w-full border-t border-neutral-700/50 pt-1 ${playerQty >= ingredient.qty ? "text-green-300" : "text-red-400"} font-bold text-sm`}>
          {playerQty} / {ingredient.qty}
        </p>
      </div>

      <Tooltip 
        id={tooltipId} 
        place="top"
        className="z-[999] !bg-neutral-950 !border !border-neutral-600 !opacity-100 shadow-2xl rounded-md"
        style={{ width: '220px', padding: '12px' }}
        clickable={true}
      >
        <div className="flex flex-col">
          <h5 className="text-amber-300 font-bold text-xs uppercase tracking-wider border-b border-neutral-800 pb-1 mb-2 text-center">
            Where to find
          </h5>

          {foundLocations.length > 0 ? (
            <ul className='text-left text-xs text-neutral-300 flex flex-col gap-1 list-disc pl-4'>
              {foundLocations.map((location, idx) => (
                <li key={idx}>{location}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-red-300 italic text-left">
              Not found foraging. Try defeating monsters or checking merchants!
            </p>
          )}
        </div>
      </Tooltip>
    </>
  )
}

export default IngredientCard;