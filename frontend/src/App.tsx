import { BrowserRouter, Routes, Route } from "react-router-dom";
import { memo } from 'react';

// import GameMenu from "./pages/GameMenu.tsx";
// import Account from "./pages/Account.tsx";
// import Game from "./pages/Game.tsx";
import Daiict from "./pages/Daiict.tsx";
import Header from "./components/Header.tsx";
import { Toaster } from "@/components/ui/sonner"

import "./App.css";

// import { useAuthContext, AuthContextType } from "./context/AuthContext.tsx";
import { useGameContext, GameContextType } from "./context/GameContext.tsx";

function App() {

  // const { authUser } = useAuthContext() as AuthContextType;
  const { gameDetails } = useGameContext() as GameContextType;
  console.log(gameDetails);

  return (
    <BrowserRouter>
      <main className="h-[100lvh] flex flex-col overflow-hidden">
      <Header />
      <Routes>
        {/* <Route index 
          element={(authUser === undefined) 
            ? <Account /> 
            : <Navigate to="/gameMenu"/>}
        />
        <Route path="gameMenu"
          element={authUser === undefined ? (
            <Navigate to="/" />
          ) : gameDetails?.secretcode !== undefined ? (
            <Navigate to="/game" />
          ) : (
              <GameMenu />
          )}
        />
        <Route path="game"
          element={(authUser === undefined || gameDetails?.secretcode === undefined) 
            ? <Navigate to="/"/> 
            : (
                <Game/>
            )} 
        /> */}
        <Route path="/"
          element={<Daiict/>} 
        />
      </Routes>
      <Toaster className="cursor-grab" />
      </main>
    </BrowserRouter>
  )
}

export default memo(App)