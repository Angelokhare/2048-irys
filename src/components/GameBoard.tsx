import React, { useState, useEffect, useRef } from 'react';
import Tile from './Tile';
import {
  generateInitialGrid,
  moveGrid,
  hasLost,
  spawnRandomTile,
} from '../utils/gameLogic';
import './GameBoard.css';

import swapSound from '/sounds/Clicks.mp3'; // Ensure this is in public/sounds/

const GameBoard: React.FC = () => {
  const [grid, setGrid] = useState(generateInitialGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const swapAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio once
  useEffect(() => {
    swapAudioRef.current = new Audio(swapSound);
    swapAudioRef.current.volume = 0.2;

    const unlockAudio = () => {
      if (swapAudioRef.current) {
        swapAudioRef.current.play().catch(() => {});
      }
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  const playSwapSound = () => {
    if (swapAudioRef.current) {
      try {
        const audio = swapAudioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch((err) =>
          console.warn('Audio playback failed:', err.message)
        );
      } catch (err) {
        console.warn('Audio error:', err);
      }
    }
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    const { newGrid, newScore, moved } = moveGrid(grid, direction);
    if (moved) {
      const updatedGrid = spawnRandomTile(newGrid);
      setGrid(updatedGrid);
      setScore(score + newScore);
      playSwapSound(); // 🔊 Play sound on move
      if (hasLost(updatedGrid)) setGameOver(true);
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (gameOver) return;
    const directionMap: { [key: string]: 'up' | 'down' | 'left' | 'right' } = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    const direction = directionMap[e.key];
    if (direction) handleMove(direction);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };
    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) handleMove('right');
      else if (dx < -30) handleMove('left');
    } else {
      if (dy > 30) handleMove('down');
      else if (dy < -30) handleMove('up');
    }
  };

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    window.addEventListener('keydown', handleKey);
    board.addEventListener('touchstart', handleTouchStart);
    board.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('keydown', handleKey);
      board.removeEventListener('touchstart', handleTouchStart);
      board.removeEventListener('touchend', handleTouchEnd);
    };
  }, [grid, gameOver]);

  const resetGame = () => {
    setGrid(generateInitialGrid());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="board-container">
      <h1 className="game-title">
        <span className="highlight">IRYS </span>2048
      </h1>
      <div className="score">Score: {score}</div>
      <div className="board" ref={boardRef}>
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <Tile key={`${i}-${j}`} value={cell} />
          ))
        )}
      </div>
      {gameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Game Over</h2>
            <button onClick={resetGame}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;