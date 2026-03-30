import { motion, AnimatePresence } from "motion/react";
import locationsData from "../../data/locations.json";
import { formatName } from "../../utils/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer, usePlayerStore } from "../../store/usePlayerStore";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.3 } }
};

const Regions = () => {

  const player = usePlayer();
  const changeLocation = usePlayerStore((state) => state.changeLocation);
  const setPlayer = usePlayerStore((state) => state.setPlayer)
  const navigate = useNavigate();
  const playerLocation = player.currentLocation;
  const currentLocationData = locationsData[playerLocation];
  const [willTravelTo, setWillTravelTo] = useState("");

  const changeSubLocation = (subLocation, travelTime = 1000) => {
    if (player.subLocation === subLocation) return;
    setPlayer({ isTraveling: true });
    setWillTravelTo(subLocation);

    setTimeout(() => {
      changeLocation(playerLocation, subLocation);
      setPlayer({ isTraveling: false });
      navigate("/explore-region");
    }, travelTime);
  };

  return (
    <section>
      <AnimatePresence>
        {player.isTraveling && (
          <motion.div
            className="fixed lg:absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm text-amber-300 text-2xl witcher-font z-[999] lg:z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <div className="w-10 h-10 border-4 border-amber-900 border-t-amber-400 rounded-full animate-spin"></div>
              <p>
                Traveling to <span className="text-white">{currentLocationData["sub_locations"][willTravelTo].name}</span>...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="heading witcher-font">
        {currentLocationData.name} Regions
      </h3>

      <motion.ul
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {Object.keys(currentLocationData["sub_locations"]).map((subLocation) => {
          const currentSubLocation = currentLocationData["sub_locations"][subLocation];

          const shopsAvailable = [];
          if (currentSubLocation.merchant) shopsAvailable.push("Merchant");
          if (currentSubLocation.blacksmith) shopsAvailable.push("Blacksmith");
          if (currentSubLocation.armorer) shopsAvailable.push("Armorer");

          return (
            <motion.li
              variants={itemVariants}
              className={`p-4 relative rounded border transition-colors cursor-pointer flex flex-col gap-2 ${subLocation === player.subLocation
                ? "border-amber-400 bg-neutral-800"
                : "border-neutral-700 bg-neutral-900/50 hover:border-amber-500/50"
                }`}
              key={subLocation}
              onClick={() => changeSubLocation(subLocation, 1500)}
            >
              <h4 className="text-xl witcher-font text-amber-300">
                {currentSubLocation.name}
              </h4>
              {currentSubLocation.canRest && (
                <span className="absolute bottom-2 right-2 text-xs font-bold text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
                  Meditate
                </span>
              )}
              <p className="text-sm text-neutral-300">
                Monsters: <span className="font-semibold text-neutral-100 capitalize">
                  {currentSubLocation.monsters_found ? currentSubLocation.monsters_found.map(formatName).join(", ") : "None"}
                </span>
              </p>

              <p className="text-sm text-neutral-300">
                Resources: <span className="font-semibold text-neutral-100 capitalize">
                  {currentSubLocation.resources_to_gather ? currentSubLocation.resources_to_gather.map(item => formatName(item.id)).join(", ") : "None"}
                </span>
              </p>

              <p className="text-sm text-neutral-300">
                Shops: <span className="font-semibold text-neutral-100">
                  {shopsAvailable.length > 0 ? shopsAvailable.join(", ") : "None"}
                </span>
              </p>
            </motion.li>
          );
        }
        )}
      </motion.ul>
    </section>
  );
};

export default Regions;