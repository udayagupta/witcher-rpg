import React from 'react';
import { usePlayerStore } from "../store/usePlayerStore";
import {CharacterCreation} from "../components/CharacterCreation/CharacterCreation";


const Layout = ({ children }) => {
  const isCharacterCreated = usePlayerStore((state) => state.isCharacterCreated);

  if (!isCharacterCreated) {
    return <CharacterCreation />
  }

  return <div className="app-shell witcher-theme p-0 lg:px-4">{children}</div>;
};

export default Layout;
