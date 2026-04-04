import contracts from "../../data/contracts.json";
import ContractCard from "./ContractCard";

const ActiveContracts = ({ activeContracts }) => {
  return (
    <div>
      {Object.keys(activeContracts).length > 0 ? (
        <ul className="mt-5 flex gap-5 flex-wrap lg:flex-nowrap">
          {Object.keys(activeContracts).map((contractId) => {
            const contractData = contracts[contractId];
            const activeContractData = activeContracts[contractId];
            return (
              <li key={contractId} className="w-full lg:w-[300px]">
                <ContractCard contractData={contractData} activeContractData={activeContractData} mode={"active"}/>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-3xl mt-15">No Active Contracts</p>
      )}
    </div>
  );
};

export default ActiveContracts;
