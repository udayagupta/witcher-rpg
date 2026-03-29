import React from "react";
import { usePlayer, usePlayerStore } from "../../store/usePlayerStore";
import contracts from "../../data/contracts.json";

const Journal = () => {
  const player = usePlayer();

  return (
    <>
      <p>This is a journal</p>
    </>
  );
};

export default Journal;
