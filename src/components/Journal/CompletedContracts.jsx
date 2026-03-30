import contracts from "../../data/contracts.json";
import ContractCard from "./ContractCard";


const CompletedContracts = ({ completedContracts }) => {
  return (
    <div>
          {completedContracts.length > 0 ? (
            <ul className="mt-5 flex gap-5">
              {completedContracts.map((contractId) => {
                const contractData = contracts[contractId];
                return (
                  <li key={contractId}>
                    <ContractCard contractData={contractData} activeContractData={null} mode={"completed"}/>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-3xl mt-15">No Completed Contracts</p>
          )}
        </div>
  )
}

export default CompletedContracts