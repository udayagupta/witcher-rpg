import { motion } from "motion/react";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import locationsData from "../../data/locations.json";
import { formatName } from "../../utils/utils";
import { useState } from "react";

const Regions = () => {
  const { player, setPlayer } = usePlayer();
  const playerLocation = player.currentLocation;
  const currentLocationData = locationsData[playerLocation];
  const [willTravelTo, setWillTravelTo] = useState("");

  const changeSubLocation = (subLocation, travelTime = 1000) => {
    setPlayer((prev) => ({ ...prev, isTraveling: true }));
    setWillTravelTo(subLocation);

    setTimeout(() => {
      setPlayer((prev) => ({ ...prev, subLocation }));
      setPlayer((prev) => ({ ...prev, isTraveling: false }));
    }, travelTime);
  };

  return (
    <section>
      {player.isTraveling && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/90 text-amber-300 text-2xl witcher-font z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          Traveling to {currentLocationData["sub_locations"][willTravelTo].name}
        </motion.div>
      )}
      <h3 className="heading witcher-font">
        {currentLocationData.name} Regions
      </h3>
      <ul className="items-list">
        {Object.keys(currentLocationData["sub_locations"]).map(
          (subLocation) => {
            const currentSubLocation =
              currentLocationData["sub_locations"][subLocation];
            return (
              <li
                className={`items-list-item ${
                  subLocation === player.subLocation
                    ? "items-list-item-selected"
                    : "items-list-item-not-selected"
                }`}
                key={subLocation}
                onClick={() => changeSubLocation(subLocation, 1500)}
              >
                <h4 className="text-lg witcher-font text-amber-300">
                  {currentSubLocation.name}
                </h4>
                <div className="capitalize">
                  <p>
                    Monsters Found:{" "}
                    <strong>
                      {currentSubLocation.monsters_found
                        ? `${currentSubLocation.monsters_found.join(", ")}`
                        : "None"}
                    </strong>
                  </p>
                </div>
                <div className="capitalize">
                  <p>
                    Resources Found:{" "}
                    <strong>
                      {currentSubLocation.resources_to_gather
                        ? currentSubLocation.resources_to_gather
                            .map(formatName)
                            .join(", ")
                        : "None"}
                    </strong>
                  </p>
                </div>
              </li>
            );
          }
        )}
      </ul>
    </section>
  );
};

export default Regions;
