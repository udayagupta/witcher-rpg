import React from "react";
import { usePlayer } from "../context/PlayerContext/PlayerContext";
import locationsData from "../data/locations.json";
import ContractsBoard from "../components/ContractsBoard/ContractsBoard";

export const Home = () => {
  const { player } = usePlayer();
  const currentLocation = locationsData[player.currentLocation];

  return (
    <>
      <ContractsBoard playerLocation={player.currentLocation} />
    </>
  );
};
