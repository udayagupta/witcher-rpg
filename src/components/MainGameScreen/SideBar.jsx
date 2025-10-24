import { NavLink } from "react-router-dom";
import { PlayerProfile } from "../PlayerProfile/PlayerProfile";

const SideBar = () => {
  return (
    <ul className="flex flex-col flex-2 w-full gap-3 witcher-font px-4">
      <li className="border rounded-md pt-sans-font">
        <PlayerProfile />
      </li>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-orange-400" : ""}`
        }
      >
        Contracts Board
      </NavLink>
      <NavLink
        to={"/journal"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-orange-400" : ""}`
        }
      >
        Journal
      </NavLink>
      <NavLink
        to={"/monster-bestiary"}
        className={({ isActive }) =>
          `side-bar-link ${isActive ? "text-orange-400" : ""}`
        }
      >
        Monster Bestiary
      </NavLink>
      <NavLink className={`side-bar-link`}>
        Inventory
      </NavLink>
    </ul>
  );
};

export default SideBar;
