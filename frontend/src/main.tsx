import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { GameContextProvider } from './context/GameContext.tsx'
import { CanvasProvider } from './context/CanvasContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
    <GameContextProvider>
    <CanvasProvider>
      <App />
    </CanvasProvider>
    </GameContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
