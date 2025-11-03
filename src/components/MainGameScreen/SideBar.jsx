import { NavLink } from "react-router-dom";
import { PlayerProfile } from "../PlayerProfile/PlayerProfile";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const SideBar = () => {
  const { player } = usePlayer();

  return (
    <ul className="flex flex-col flex-2 overflow-auto gap-3 witcher-font">
      <li className="rounded-md pt-sans-font">
        <PlayerProfile />
      </li>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""} ${
            player.inBattle ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"
          }`
        }
      >
        Regions Map 🏞️
      </NavLink>
      <NavLink
        to={`/explore-region`}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""} ${
            player.inBattle ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"
          }`
        }
      >
        Explore Region ⛰️
      </NavLink>
      <NavLink
        to={"/world-map"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""} ${
            player.inBattle ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"
          }`
        }
      >
        World Map 🗺️
      </NavLink>
      <NavLink
        to={"/contracts-board"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""} ${
            player.inBattle ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"
          }`
        }
      >
        Contracts Board 🪧
      </NavLink>
      <NavLink
        to={"/journal"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""} ${
            player.inBattle ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"
          }`
        }
      >
        Journal 📜
      </NavLink>
      <NavLink
        to={"/monster-bestiary"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""} ${
            player.inBattle ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"
          }`
        }
      >
        Monster Bestiary 🐦‍🔥
      </NavLink>
      <NavLink className={`side-bar-link`}>Inventory 📦</NavLink>
      <NavLink className={`side-bar-link`}>Alcehmy 🧪</NavLink>
    </ul>
  );
};

export default SideBar;
