import { NavLink } from "react-router-dom";
import { PlayerProfile } from "../PlayerProfile/PlayerProfile";

const SideBar = () => {
  return (
    <ul className="flex flex-col flex-2 h-screen overflow-auto gap-3 witcher-font">
      <li className="rounded-md pt-sans-font">
        <PlayerProfile />
      </li>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""}`
        }
      >
        Regions Map 🏞️
      </NavLink>
      <NavLink
        to={`/explore-region`}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""}`
        }
      >
        Explore Region ⛰️
      </NavLink>
      <NavLink
        to={"/world-map"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""}`
        }
      >
        World Map 🗺️
      </NavLink>
      <NavLink
        to={"/contracts-board"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""}`
        }
      >
        Contracts Board 🪧
      </NavLink>
      <NavLink
        to={"/journal"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""}`
        }
      >
        Journal 📜
      </NavLink>
      <NavLink
        to={"/monster-bestiary"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-amber-300" : ""}`
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
