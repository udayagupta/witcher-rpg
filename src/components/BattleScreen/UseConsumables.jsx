import { usePlayer } from '../../context/PlayerContext/PlayerContext'
import itemsData from "../../data/items.json";

const UseConsumables = ({ applyOil }) => {
  const { player } = usePlayer();

  // useEffect(() => {
  //   console.log(player.inventory.oils);
  // }, [player])

  return (
    <div className="use-consumables flex gap-3 rounded-md mt-5">
      <div className="oils flex-1 p-2 bg-neutral-800 rounded-md">
        <h4 className="heading witcher-font text-md my-2 p-0">Oils</h4>
        <ul className="grid grid-cols-2 gap-2">
          {player.inventory.oils.map((item) => {
            const oil = itemsData.oils[item.id]
            return (
              <li key={item.id} onClick={() => applyOil(oil.name, oil.id)} className={` bg-neutral-900 witcher-font rounded-md p-2 py-3 flex flex-col justify-center items-center border-2 border-transparent hover:border-amber-300 hover:text-amber-300 transition duration-200 ${item.qty < 1 ? "opacity-70" : "cursor-pointer "}`}>
                <img src={`./images/oils/${oil.img}.png`} className="h-[35px] w-[35px]" alt={`${oil.name} Oil Image`} />
                <p>{oil?.name || item.id}</p>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="oils flex-1 p-2 bg-neutral-800 rounded-md">
        <h4 className="heading witcher-font text-md my-2 p-0">Potions</h4>
        <ul className="grid grid-cols-2 gap-2">
          {player.inventory.potions.map((item) => {
          const potion = itemsData.potions[item.id]
          return (
            <li key={item.id} className={`bg-neutral-900 witcher-font rounded-md p-2 py-3 flex flex-col justify-center items-center border-2 border-transparent hover:border-amber-300 hover:text-amber-300 transition duration-200 ${item.qty < 1 ? "opacity-70" : "cursor-pointer "}`}>
              {potion?.name || item.id}
            </li>
          )
        })}
        </ul>
      </div>
      <div className="oils flex-1 p-2 bg-neutral-800 rounded-md">
        <h4 className="heading witcher-font text-md my-2 p-0">Foods</h4>
        <ul className="grid grid-cols-2 gap-2">
          {player.inventory.foods.map((item) => {
          const food = itemsData.foods[item.id]
          return (
            <li key={item.id} className={`bg-neutral-900 witcher-font rounded-md p-2 py-3 flex flex-col justify-center items-center border-2 border-transparent hover:border-amber-300 hover:text-amber-300 transition duration-200 ${item.qty < 1 ? "opacity-70" : "cursor-pointer "}`}>
              {food?.name || item.id}
            </li>
          )
        })}
        </ul>
      </div>
    </div>
  )
}

export default UseConsumables