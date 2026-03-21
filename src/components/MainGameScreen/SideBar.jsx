import { NavLink } from "react-router-dom";
import { PlayerProfile } from "../PlayerProfile/PlayerProfile";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const NAV_LINKS = [
  { path: "/inventory", label: "Inventory 📦" },
  { path: "/", label: "Regions Map 🏞️" },
  { path: "/explore-region", label: "Explore Region ⛰️" },
  { path: "/world-map", label: "World Map 🗺️" },
  { path: "/contracts-board", label: "Contracts Board 🪧" },
  { path: "/journal", label: "Journal 📜" },
  { path: "/monster-bestiary", label: "Monster Bestiary 🐦‍🔥" },
  { path: "/alchemy", label: "Alchemy 🧪" },
];

const SideBar = () => {
  const { player } = usePlayer();

  const getNavClasses = ({ isActive }) => {
    return `side-bar-link card hover:border-amber-300 ${isActive ? "text-amber-300 border-amber-300" : ""} ${
      player.inBattle 
        ? "pointer-events-none cursor-not-allowed" 
        : "pointer-events-auto"
    }`;
  };

  return (
    <div className="flex flex-col flex-2 overflow-auto gap-3 witcher-font">
      <div className="rounded-md pt-sans-font">
        <PlayerProfile />
      </div>
      
      <ul className="flex flex-col p-1 gap-2">
        {NAV_LINKS.map((link) => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            className={getNavClasses}
          >
            {link.label}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;