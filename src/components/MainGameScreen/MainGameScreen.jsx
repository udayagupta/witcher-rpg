import { PlayerProfile } from "../PlayerProfile/PlayerProfile";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import locationsData from "../../data/locations.json";
import { NavLink, Outlet, useNavigation, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const MainGameScreen = () => {
  const { player } = usePlayer();
  const currentLocation = locationsData[player.currentLocation];
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const location = useLocation();

  return (
    <main className="flex flex-col">
      <div className="text-center p-2">
        <h1 className="text-3xl witcher-font">The Witcher: Text-Based RPG</h1>
      </div>
      <div className="flex gap-5">
        <ul className="flex flex-col flex-2 w-full gap-3 witcher-font">
          <li className="border pt-sans-font">
            <PlayerProfile className={""} />
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
        </ul>
        <section className="w-full flex flex-5 flex-col gap-3 text-center p-4 main-game-menu">
          <h2 className="text-3xl flex justify-center gap-5">
            {player.name} is in {currentLocation.name}{" "}
            <img
              className="h-[40px] w-[40px]"
              src={currentLocation.badge}
              alt=""
            />
          </h2>
          <p className="text-xl">{currentLocation.place_description}</p>
          {/* <ContractsBoard playerLocation={player.currentLocation} /> */}
          <div className="relative overflow-hidden">
            {/* <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                // className="absolute inset-0"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence> */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
