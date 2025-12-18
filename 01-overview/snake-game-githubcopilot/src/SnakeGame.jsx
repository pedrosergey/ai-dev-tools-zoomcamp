import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState('walls'); // 'walls' o 'pass-through'

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
    } while (snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood([15, 15]);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      let newHead = [head[0] + direction.x, head[1] + direction.y];

      // Modo pass-through: la serpiente atraviesa las paredes
      if (gameMode === 'pass-through') {
        if (newHead[0] < 0) newHead[0] = GRID_SIZE - 1;
        if (newHead[0] >= GRID_SIZE) newHead[0] = 0;
        if (newHead[1] < 0) newHead[1] = GRID_SIZE - 1;
        if (newHead[1] >= GRID_SIZE) newHead[1] = 0;
      } else {
        // Modo walls: verificar colisiones con paredes
        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }
      }

      // Verificar colisiones con el cuerpo
      if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Verificar si comió la comida
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood(generateFood());
        setScore(prev => prev + 10);
        return newSnake;
      }

      // Mover la serpiente (quitar el último segmento)
      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, gameMode, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying && !gameOver && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        setIsPlaying(true);
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-emerald-950 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl p-6 border-4 border-green-600">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-green-400">Snake Game</h1>
          <div className="text-2xl font-bold text-white">
            Puntos: <span className="text-yellow-400">{score}</span>
          </div>
        </div>

        {/* Selector de modo */}
        <div className="mb-4 flex gap-2 justify-center">
          <button
            onClick={() => {
              setGameMode('walls');
              if (isPlaying) resetGame();
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              gameMode === 'walls'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🧱 Walls Mode
          </button>
          <button
            onClick={() => {
              setGameMode('pass-through');
              if (isPlaying) resetGame();
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              gameMode === 'pass-through'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🌀 Pass-Through Mode
          </button>
        </div>
        
        <div 
          className="relative bg-black border-4 border-green-500"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE 
          }}
        >
          {/* Serpiente */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: segment[0] * CELL_SIZE,
                top: segment[1] * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: index === 0 ? '#22c55e' : '#16a34a',
                border: '1px solid #15803d',
                borderRadius: index === 0 ? '4px' : '2px'
              }}
            />
          ))}
          
          {/* Comida */}
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              left: food[0] * CELL_SIZE,
              top: food[1] * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
            }}
          />

          {/* Pantalla de Game Over */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
              <p className="text-2xl text-white mb-4">Puntuación: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Jugar de Nuevo
              </button>
            </div>
          )}

          {/* Pantalla de Inicio */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-green-400 mb-4">¡Presiona una tecla para comenzar!</h2>
              <div className="text-gray-300 text-center">
                <p>Usa las flechas o WASD para moverte</p>
                <p className="mt-2">🍎 Come la comida para crecer</p>
                <p className="mt-2 text-sm text-yellow-400">
                  Modo: {gameMode === 'walls' ? '🧱 Walls (chocas con paredes)' : '🌀 Pass-Through (atraviesas paredes)'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-gray-300 text-center text-sm">
          <p>Usa las teclas de flecha para controlar la serpiente</p>
          <p>¡Evita las paredes y tu propio cuerpo!</p>
        </div>
      </div>
    </div>
  );
}

