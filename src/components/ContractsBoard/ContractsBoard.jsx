import { useState } from "react";
import locationsData from "../../data/locations.json";
import contracts from "../../data/contracts.json";
import { usePlayer } from "../../store/usePlayerStore";
import ContractCard from "./ContractCard";

const ContractsBoard = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const player = usePlayer();

  const contractsIds = locationsData[player.currentLocation].contracts;

  const selectContract = (contract) => {
    setSelectedContract(contract);
  };

  return (
    <section className="contracts-board h-full text-lg gap-5 flex bg-gradient-to-b from-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg p-4">
      <div className="flex-2 px-4">
        <h3 className="text-2xl p-2 witcher-font text-amber-300">Contracts</h3>
        {/* flex flex-col gap-2 */}
        <ul className="lg:grid lg:grid-cols-3  gap-5 flex-col flex flex-wrap">
          {contractsIds.map((item) => (
            (!player.completedQuests.includes(item) && (
              <li
                key={item}
                onClick={() => selectContract(item)}
                className={`contract-li flex-1 rounded cursor-pointer flex flex-col overflow-hidden transition p-1 ${selectedContract === item
                    ? "border border-amber-300 bg-neutral-900/20 "
                    : "border border-neutral-700 bg-neutral-900/10 hover:border-amber-300"
                  }`}
              >
                <p className="p-2 font-semibold witcher-font">{contracts[item].name}</p>
                <p className="text-[16px] p-2 opacity-90">{contracts[item].description}</p>
              </li>
            ))
          ))}
        </ul>
      </div>

      { selectedContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <ContractCard selectedContract={selectedContract} setSelectedContract={setSelectedContract}/>
        </div>
      ) }
    </section>
  );
};

export default ContractsBoard;
