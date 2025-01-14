import logo from './logo.svg';
import './App.css';
import React from 'react';
import Welcome from './Welcome';
import CaptureFace from './CaptureFace';
import ClothingGame from './ClothingGame';
import Login from './Login';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';


function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCaptureFace, setShowCaptureFace] = useState(false);
  const [showClothingGame, setShowClothingGame] = useState(false);
  const [username, setUsername] = useState("");
  const [face, setFace] = useState(null);
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Fashion App
          </Typography>
        </Toolbar>
      </AppBar>
      {showLogin && <Login username={username} setUsername={setUsername} setShowWelcome={setShowWelcome} setShowLogin={setShowLogin}/>}
      {showWelcome && <Welcome setShowWelcome={setShowWelcome} setShowCaptureFace={setShowCaptureFace} />}
      {showCaptureFace && <CaptureFace setShowCaptureFace={setShowCaptureFace} setShowClothingGame={setShowClothingGame} setFace={setFace} face={face}/>}
      {showClothingGame && <ClothingGame face={face} username={username} setShowCaptureFace={setShowCaptureFace} setShowClothingGame={setShowClothingGame} />}
    </div>
  );
}

export default App;


