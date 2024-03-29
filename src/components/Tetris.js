import React from 'react';
import { useState } from 'react';
import ReactHowler from 'react-howler';

import bgMusic from '../sounds/tetris.mp3';
import { VolumeUp, VolumeOff} from '@material-ui/icons';
import { createStage, checkCollision } from '../gameHelpers';

// Styled Components
import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [volume, setVolume] = useState(null);
    const [paused, setPaused] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    const movePlayer = dir => {
        if (!checkCollision(player, stage, {x: dir, y: 0}))        
            updatePlayerPos({x: dir, y: 0});
    }

    const startGame = () => {
        setStage(createStage());
        setDropTime(1000 / (level + 1) + 200);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
        setVolume(true);
        setPaused(false);
    }

    const drop = () => {
        // increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10){
            setLevel(prev => prev + 1);
            // increase speed
            setDropTime(1000 / (level + 1) + 200);
        }
        if (!checkCollision(player, stage, {x: 0, y: 1})){
            updatePlayerPos({ x: 0 , y: 1, collided: false });
        }else{
            if (player.pos.y < 1) {
                console.log("GAME OVER!!!");
                setGameOver(true);
                setDropTime(null)
            }
            updatePlayerPos({ x: 0 , y: 0, collided: true });
        }       
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver){
            if(keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }
    
    const pauseGame = () => {
        if(!paused){
            setDropTime(null);
            setVolume(false);
            setPaused(true);
        } else if(paused){
            setDropTime(1000 / (level + 1) + 200);
            setVolume(true);
            setPaused(false);
        }
    }

    const move = ({ keyCode }) => {
        if (!gameOver){
            if(keyCode === 37) {
                movePlayer(-1);
            }else if(keyCode === 39) {
                movePlayer(1);
            }else if(keyCode === 40) {
                dropPlayer();
            }else if(keyCode === 38) {
                playerRotate(stage, 1);
            }else if(keyCode === 32) {
                pauseGame(); 
            }
        }
    }

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                <Stage stage={stage} paused={paused}/>
                <aside>
                    <ReactHowler
                        src={bgMusic}
                        playing={volume}
                        loop={true}
                    />
                    {gameOver && (
                        <Display gameOver={gameOver} text="Game Over" />
                    )}
                    <div>
                        <Display text={`Score: ${score}`} />
                        <Display text={`Rows: ${rows}`} />
                        <Display text={`Level: ${level}`} />
                        <Display text={volume ? <VolumeUp onClick={() =>{setVolume(!volume)} }/> : <VolumeOff onClick={() =>{setVolume(!volume)} }/> }/>    
                    </div>
                    <StartButton callback={startGame}/>
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;