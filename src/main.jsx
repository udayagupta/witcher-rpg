import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PlayerProvider } from './context/PlayerContext/PlayerContext.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainGameScreen from './components/MainGameScreen/MainGameScreen.jsx';
import Layout from './components/Layout.jsx';
import Journal from './components/Journal/Journal.jsx';
import MonsterBestiary from './pages/MonsterBestiary.jsx';
import WorldMap from './components/WorldMap/WorldMap.jsx';
import Regions from './components/Regions/Regions.jsx';
import ContractsBoard from './components/ContractsBoard/ContractsBoard.jsx';
import ExploreRegion from './components/Regions/ExploreRegion.jsx';
import Inventory from './pages/Inventory.jsx';
import CraftingAlchemy from './components/CraftingAlchemy/CraftingAlchemy.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <MainGameScreen />
      </Layout>
    ),
    children: [
      { index: true, element: <Regions /> },
      { path: "contracts-board", element: <ContractsBoard />},
      { path: "explore-region", element: <ExploreRegion />},
      { path: "journal", element: <Journal /> },
      { path: "monster-bestiary", element: <MonsterBestiary /> },
      { path: "inventory", element: <Inventory /> },
      { path: "world-map", element: <WorldMap /> },
      { path: "crafting-alchemy", element: <CraftingAlchemy /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlayerProvider>
      <RouterProvider router={router}/>
    </PlayerProvider>
  </StrictMode>,
)
