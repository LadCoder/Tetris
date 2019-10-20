import React from 'react';
import Tetris from './components/Tetris';
import ReactHowler from 'react-howler';
import bgMusic from './sounds/tetris.mp3';

const App = () => (
  <div className="App">
    <ReactHowler
      src={bgMusic}
      playing={true}
      loop={true}
    />
    <Tetris />
    
  </div>
);

export default App;