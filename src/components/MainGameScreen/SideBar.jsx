import { NavLink } from "react-router-dom";
import { PlayerProfile } from "../PlayerProfile/PlayerProfile";
import { usePlayer } from "../../store/usePlayerStore";

const NAV_LINKS = [
  { path: "/explore-region", label: "Explore Region ⛰️" },
  { path: "/", label: "Regions Map 🏞️" },
  { path: "/inventory", label: "Inventory 📦" },
  { path: "/world-map", label: "World Map 🗺️" },
  { path: "/contracts-board", label: "Contracts Board 🪧" },
  { path: "/journal", label: "Journal 📜" },
  { path: "/monster-bestiary", label: "Monster Bestiary 🐦‍🔥" },
  { path: "/crafting-alchemy", label: "Crafting & Alchemy 🧪" },
];

const SideBar = ({ isOpen, setIsOpen }) => {
  const player = usePlayer();

  const getNavClasses = ({ isActive }) => {
    return `side-bar-link card hover:border-amber-300 w-full ${isActive ? "text-amber-300 border-amber-300 bg-neutral-800" : ""} ${
      player.inBattle 
        ? "pointer-events-none cursor-not-allowed opacity-50" 
        : "pointer-events-auto"
    }`;
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 w-full z-50 bg-neutral-950 border-r border-neutral-700 p-4 transform transition-transform duration-300 ease-in-out overflow-y-auto side-bar lg:relative lg:translate-x-0 lg:w-auto lg:flex-2 lg:bg-transparent lg:border-none lg:p-0 flex flex-col gap-3 witcher-font
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >

      <div className="flex justify-between items-center lg:hidden mb-2 border-b border-neutral-700 pb-2">
        <span className="text-amber-300 font-bold text-lg">Menu</span>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-neutral-400 hover:text-white text-2xl"
        >
          &times;
        </button>
      </div>

      <div className="rounded-md pt-sans-font w-full">
        <PlayerProfile />
      </div>
      
      <ul className="flex flex-col p-1 gap-2 w-full">
        {NAV_LINKS.map((link) => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            className={getNavClasses}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;