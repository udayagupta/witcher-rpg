import { useEffect } from "react";

const BattleLogs = ({ battleState }) => {

  useEffect(() => {
    const element = document.getElementById("battleLogs");
    if (element) {
      setTimeout(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  }, [battleState.battleLogs]);

  return (
    <div className="battle-logs  bg-neutral-800 rounded-md flex-1 p-2 ">
      <h3 className="heading witcher-font">Battle Logs</h3>
      <ul
        id="battleLogs"
        className="overflow-auto py-1 flex flex-col gap-1 max-h-[450px]"
      >
        {battleState.battleLogs.map((log, index) => (
          <li
            className={`border py-2 px-1 rounded-md mx-2 ${index === battleState.battleLogs.length - 1
              ? "border-amber-300"
              : "border-neutral-600"
              }`}
            key={index}
          >
            {log}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BattleLogs