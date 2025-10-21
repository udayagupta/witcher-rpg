import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayerProvider } from './context/PlayerContext/PlayerContext.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainGameScreen from './components/MainGameScreen/MainGameScreen.jsx';
import { Home } from './pages/Home.jsx';
import Journal from './components/Journal/Journal.jsx';
import MonsterBestiary from './pages/MonsterBestiary.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainGameScreen />,
    children: [
      { index: true, element: <Home />},
      { path: "journal", element: <Journal />},
      { path: "monster-bestiary", element: <MonsterBestiary />}
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
