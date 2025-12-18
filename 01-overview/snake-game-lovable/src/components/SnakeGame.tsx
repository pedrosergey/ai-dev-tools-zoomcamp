import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameMode = "wall" | "pass-through";

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("snakeHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("wall");
  const directionRef = useRef(direction);

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setHasStarted(true);
  }, [generateFood]);

  const togglePause = useCallback(() => {
    if (gameOver) return;
    setIsPlaying((prev) => !prev);
  }, [gameOver]);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(false);
    setHasStarted(false);
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
  }, [generateFood]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && e.key === " ") {
        resetGame();
        return;
      }

      if (gameOver) {
        if (e.key === " ") resetGame();
        return;
      }

      const currentDir = directionRef.current;
      let newDirection: Direction | null = null;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir !== "DOWN") newDirection = "UP";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir !== "UP") newDirection = "DOWN";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir !== "RIGHT") newDirection = "LEFT";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir !== "LEFT") newDirection = "RIGHT";
          break;
      }

      if (newDirection) {
        setDirection(newDirection);
        directionRef.current = newDirection;
      }
    },
    [gameOver, isPlaying, resetGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const dir = directionRef.current;
        let newHead: Position;

        switch (dir) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Handle wall collision based on game mode
        if (gameMode === "wall") {
          if (
            newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE
          ) {
            setGameOver(true);
            setIsPlaying(false);
            return prevSnake;
          }
        } else {
          // Pass-through mode: wrap around
          if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
          if (newHead.x >= GRID_SIZE) newHead.x = 0;
          if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
          if (newHead.y >= GRID_SIZE) newHead.y = 0;
        }

        // Check self collision
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("snakeHighScore", newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - score);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, generateFood, score, highScore, gameMode]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode Selector - Always visible */}
      <div className="flex gap-2">
        <Button
          variant={gameMode === "wall" ? "default" : "outline"}
          size="sm"
          onClick={() => setGameMode("wall")}
        >
          Wall Mode
        </Button>
        <Button
          variant={gameMode === "pass-through" ? "default" : "outline"}
          size="sm"
          onClick={() => setGameMode("pass-through")}
        >
          Pass-Through
        </Button>
      </div>

      {/* Game Controls */}
      <div className="flex gap-2">
        {!isPlaying && !gameOver ? (
          <Button onClick={resetGame} variant="outline" size="sm">
            Start
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} variant="outline" size="sm">
              {isPlaying ? "Pause" : "Resume"}
            </Button>
            <Button onClick={stopGame} variant="outline" size="sm">
              Stop
            </Button>
            <Button onClick={resetGame} variant="outline" size="sm">
              Restart
            </Button>
          </>
        )}
      </div>

      {/* Score Display */}
      <div className="flex gap-8 text-sm">
        <div className="text-foreground text-glow">
          SCORE: <span className="text-primary">{score}</span>
        </div>
        <div className="text-muted-foreground">
          HIGH: <span className="text-accent">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div
        className="relative border-2 border-primary rounded-lg border-glow bg-card"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm transition-all duration-75 ${
              index === 0 ? "snake-glow bg-primary" : "bg-primary/80"
            }`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute rounded-full bg-accent food-glow"
          style={{
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-4 rounded-lg">
            <p className="text-destructive text-glow text-lg animate-flash">GAME OVER</p>
            <p className="text-foreground text-xs">Score: {score}</p>
            <Button onClick={resetGame} variant="outline" size="sm" className="mt-2">
              PLAY AGAIN
            </Button>
          </div>
        )}

        {/* Start Screen */}
        {!isPlaying && !gameOver && !hasStarted && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-4 rounded-lg">
            <p className="text-primary text-glow text-lg">SNAKE</p>
            <p className="text-muted-foreground text-[8px] text-center px-4">
              Use Arrow Keys or WASD
            </p>
          </div>
        )}

        {/* Paused Overlay */}
        {!isPlaying && !gameOver && hasStarted && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-4 rounded-lg">
            <p className="text-primary text-glow text-lg">PAUSED</p>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <p className="text-muted-foreground text-[8px]">
        {isPlaying ? "↑ ↓ ← → or WASD to move" : "Use buttons above to control"}
      </p>
    </div>
  );
};

export default SnakeGame;
