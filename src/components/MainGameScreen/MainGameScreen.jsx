import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import locationsData from "../../data/locations.json";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import SideBar from "./SideBar";

const MainGameScreen = () => {
  const { player } = usePlayer();
  const currentLocation = locationsData[player.currentLocation];
  const subCurrentLocation = locationsData[player.currentLocation]["sub_locations"][player.subLocation];
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const location = useLocation();

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <div className="text-center p-2">
        <h1 className="text-3xl witcher-font text-amber-300">The Witcher: Text-Based RPG</h1>
      </div>
      <div className="flex gap-4">
        <SideBar />
        <section className="w-full border border-amber-300 flex flex-5 flex-col gap-3 text-center p-4 main-game-menu bg-neutral-900/30 rounded-lg shadow-lg">
          <h2 className="text-3xl flex justify-center gap-5 witcher-font">
            <span className="font-semibold">{player.name}</span> is in <span className="text-amber-300 font-extrabold">{subCurrentLocation.name}, {currentLocation.name}</span>
            <img
              className="h-[40px] w-[40px] ml-2"
              src={currentLocation.badge}
              alt={currentLocation.name}
            />
          </h2>
          {/* <p className="text-xl opacity-90">{currentLocation.place_description}</p> */}
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
