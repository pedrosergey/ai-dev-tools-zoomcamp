import React, { useEffect, useRef, useCallback, useState } from 'react';
import { GameState, GameMode } from '@/types/game';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  getDirectionFromKey,
  GRID_SIZE,
  CELL_SIZE,
} from '@/lib/gameLogic';

interface GameBoardProps {
  mode: GameMode;
  onGameOver?: (score: number) => void;
  isSpectating?: boolean;
  spectatorState?: GameState | null;
}

export function GameBoard({ mode, onGameOver, isSpectating = false, spectatorState }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(mode));
  const gameStateRef = useRef(gameState);
  const animationFrameRef = useRef<number>();
  const lastMoveTimeRef = useRef<number>(0);

  // Use spectator state if provided
  const displayState = isSpectating && spectatorState ? spectatorState : gameState;

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Reset game when mode changes
  useEffect(() => {
    if (!isSpectating) {
      const newState = createInitialState(mode);
      setGameState(newState);
      gameStateRef.current = newState;
    }
  }, [mode, isSpectating]);

  // Keyboard controls
  useEffect(() => {
    if (isSpectating) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      const direction = getDirectionFromKey(e.key);
      if (direction) {
        setGameState((prev) => ({
          ...prev,
          direction: changeDirection(prev.direction, direction),
        }));
      }

      if (e.key === ' ') {
        e.preventDefault();
        setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
      }

      if (e.key === 'r' || e.key === 'R') {
        const newState = createInitialState(mode);
        setGameState(newState);
        gameStateRef.current = newState;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isSpectating]);

  // Game loop
  useEffect(() => {
    if (isSpectating) return;

    const gameLoop = (timestamp: number) => {
      const state = gameStateRef.current;
      
      if (!state.isGameOver && !state.isPaused) {
        if (timestamp - lastMoveTimeRef.current >= state.speed) {
          const newState = moveSnake(state);
          setGameState(newState);
          gameStateRef.current = newState;
          lastMoveTimeRef.current = timestamp;

          if (newState.isGameOver && onGameOver) {
            onGameOver(newState.score);
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onGameOver, isSpectating]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = displayState;
    const size = GRID_SIZE * CELL_SIZE;

    // Clear canvas
    ctx.fillStyle = 'hsl(220, 20%, 6%)';
    ctx.fillRect(0, 0, size, size);

    // Draw grid
    ctx.strokeStyle = 'hsl(220, 20%, 12%)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(size, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw border for walls mode
    if (state.mode === 'walls') {
      ctx.strokeStyle = 'hsl(0, 84%, 60%)';
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, size - 3, size - 3);
    } else {
      ctx.strokeStyle = 'hsl(200, 100%, 60%)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(1, 1, size - 2, size - 2);
      ctx.setLineDash([]);
    }

    // Draw food with glow effect
    ctx.shadowColor = 'hsl(0, 84%, 60%)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'hsl(0, 84%, 60%)';
    ctx.beginPath();
    ctx.arc(
      state.food.x * CELL_SIZE + CELL_SIZE / 2,
      state.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake with glow effect
    ctx.shadowColor = 'hsl(142, 76%, 50%)';
    ctx.shadowBlur = 10;
    
    state.snake.forEach((segment, index) => {
      const isHead = index === 0;
      const brightness = Math.max(40, 70 - index * 3);
      ctx.fillStyle = isHead 
        ? 'hsl(142, 76%, 50%)' 
        : `hsl(142, 76%, ${brightness}%)`;
      
      const padding = isHead ? 1 : 2;
      ctx.fillRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2
      );

      // Draw eyes on head
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'hsl(220, 20%, 6%)';
        const eyeSize = 3;
        const eyeOffset = CELL_SIZE / 4;
        
        let eyeX1, eyeY1, eyeX2, eyeY2;
        switch (state.direction) {
          case 'UP':
            eyeX1 = segment.x * CELL_SIZE + eyeOffset;
            eyeY1 = segment.y * CELL_SIZE + eyeOffset;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize;
            eyeY2 = eyeY1;
            break;
          case 'DOWN':
            eyeX1 = segment.x * CELL_SIZE + eyeOffset;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize;
            eyeY2 = eyeY1;
            break;
          case 'LEFT':
            eyeX1 = segment.x * CELL_SIZE + eyeOffset;
            eyeY1 = segment.y * CELL_SIZE + eyeOffset;
            eyeX2 = eyeX1;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize;
            break;
          case 'RIGHT':
          default:
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize;
            eyeY1 = segment.y * CELL_SIZE + eyeOffset;
            eyeX2 = eyeX1;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize;
            break;
        }
        
        ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
        ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
        ctx.shadowBlur = 10;
      }
    });

    ctx.shadowBlur = 0;

    // Draw game over overlay
    if (state.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, size, size);
      
      ctx.font = 'bold 24px "Press Start 2P", monospace';
      ctx.fillStyle = 'hsl(0, 84%, 60%)';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', size / 2, size / 2 - 30);
      
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillStyle = 'hsl(0, 0%, 95%)';
      ctx.fillText(`Score: ${state.score}`, size / 2, size / 2 + 10);
      ctx.fillText('Press R to restart', size / 2, size / 2 + 40);
    }

    // Draw pause overlay
    if (state.isPaused && !state.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, size, size);
      
      ctx.font = 'bold 20px "Press Start 2P", monospace';
      ctx.fillStyle = 'hsl(50, 100%, 60%)';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', size / 2, size / 2);
      
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillStyle = 'hsl(0, 0%, 95%)';
      ctx.fillText('Press SPACE to resume', size / 2, size / 2 + 30);
    }
  }, [displayState]);

  // Render on state change
  useEffect(() => {
    render();
  }, [displayState, render]);

  const handleRestart = () => {
    if (isSpectating) return;
    const newState = createInitialState(mode);
    setGameState(newState);
    gameStateRef.current = newState;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-lg">Score:</span>
          <span className="font-pixel text-2xl md:text-3xl text-primary neon-text">{displayState.score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Mode:</span>
          <span className={`font-medium ${displayState.mode === 'walls' ? 'text-destructive' : 'text-neon-blue'}`}>
            {displayState.mode === 'walls' ? 'Walls' : 'Pass-through'}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-lg neon-border"
        />
        {isSpectating && (
          <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            LIVE
          </div>
        )}
      </div>

      {!isSpectating && (
        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
          >
            Restart (R)
          </button>
          <button
            onClick={() => setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
          >
            {gameState.isPaused ? 'Resume' : 'Pause'} (Space)
          </button>
        </div>
      )}
    </div>
  );
}
