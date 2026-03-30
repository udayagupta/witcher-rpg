import locationsData from "../../data/locations.json";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import SideBar from "./SideBar";
import { usePlayer } from "../../store/usePlayerStore";
import { useState } from "react";

const MainGameScreen = () => {

  const player = usePlayer();

  const currentLocation = locationsData[player.currentLocation];
  const subCurrentLocation = locationsData[player.currentLocation]["sub_locations"][player.subLocation];
  const location = useLocation();

  const [isMobileOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">

      <div className="lg:hidden flex justify-between items-center p-3 bg-neutral-950 border-b border-neutral-700 sticky top-0 z-40 shadow-lg">
        <h1 className="text-xl witcher-font text-neutral-100 truncate">The Witcher RPG</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-amber-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>


      <div className="hidden lg:block text-center p-2">
        <h1 className="text-4xl witcher-font text-neutral-100">The Witcher: Text-Based RPG</h1>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden relative p-2 lg:p-0">

        <SideBar isOpen={isMobileOpen} setIsOpen={setIsMobileMenuOpen} />

        {isMobileOpen && (
          <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        <section className="w-full border-0 lg:border border-neutral-700  flex flex-5 flex-col gap-3 text-center p-4 main-game-menu bg-neutral-900/30 rounded-lg shadow-lg">
          <h2 className="lg:text-3xl text-2xl flex justify-center gap-5 witcher-font">
            <div className="flex justify-center items-center">
              <p><span className="font-extrabold "><span className="text-amber-300">{subCurrentLocation.name}</span>, {currentLocation.name}</span></p>
              <img
                className="h-[40px] w-[40px] ml-2 hidden lg:block"
                src={currentLocation.badge}
                alt={currentLocation.name}
              />
            </div>
          </h2>
          <div className="relative overflow-hidden h-full">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MainGameScreen;
