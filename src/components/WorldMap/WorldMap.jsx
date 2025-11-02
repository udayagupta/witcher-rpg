import locationsData from "../../data/locations.json";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const WorldMap = () => {
  const { player, setPlayer } = usePlayer();
  const [willTravelTo, setWillTravelTo] = useState("");
  const navigate = useNavigate();

  const changeMainLocation = (mainLocation, travelTime = 1000) => {
    if (player.currentLocation === mainLocation) return;

    setPlayer((prev) => ({ ...prev, isTraveling: true }));
    setWillTravelTo(mainLocation);

    setTimeout(() => {
      setPlayer((prev) => ({
        ...prev,
        currentLocation: mainLocation,
        subLocation: locationsData[mainLocation]["default_sub_location"],
      }));
      setPlayer((prev) => ({ ...prev, isTraveling: false }));
      navigate("/explore-region");
    }, travelTime);
  };

  return (
    <section className="card w-full h-full">
      {player.isTraveling && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/90 text-amber-300 text-2xl witcher-font z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3">
            Traveling to {locationsData[willTravelTo].name}
            <img
              className="h-[50px] w-[50px]"
              src={locationsData[willTravelTo].badge}
              alt=""
            />
          </div>
        </motion.div>
      )}

      <h3 className="heading witcher-font">World Locations</h3>
      <ul className="items-list">
        {Object.keys(locationsData).map((mainLocation) => {
          const locationData = locationsData[mainLocation];

          return (
            <li
              key={mainLocation}
              className={`items-list-item ${
                mainLocation === player.currentLocation
                  ? "items-list-item-selected"
                  : "items-list-item-not-selected"
              }`}
              onClick={() => changeMainLocation(mainLocation, 2000)}
            >
              <h4 className="text-lg witcher-font text-amber-300">
                {locationData.name}
              </h4>
              {/* <p>{locationData.place_description}</p> */}
              <img
                src={locationData.badge}
                alt={locationData.name}
                className="h-20 w-20 object-contain mt-2"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WorldMap;
