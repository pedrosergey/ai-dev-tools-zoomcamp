import { Direction, GameMode, GameState, Position } from '@/types/game';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SPEED = 150;

export function createInitialState(mode: GameMode): GameState {
  const centerX = Math.floor(GRID_SIZE / 2);
  const centerY = Math.floor(GRID_SIZE / 2);
  
  return {
    snake: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ],
    food: generateFood([{ x: centerX, y: centerY }]),
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: false,
    mode,
    speed: INITIAL_SPEED,
  };
}

export function generateFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
}

export function getNextHead(head: Position, direction: Direction, mode: GameMode): Position {
  let newHead: Position;
  
  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  
  // Handle pass-through mode (wrap around)
  if (mode === 'pass-through') {
    if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
    if (newHead.x >= GRID_SIZE) newHead.x = 0;
    if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
    if (newHead.y >= GRID_SIZE) newHead.y = 0;
  }
  
  return newHead;
}

export function checkWallCollision(head: Position): boolean {
  return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
}

export function checkSelfCollision(head: Position, body: Position[]): boolean {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

export function moveSnake(state: GameState): GameState {
  if (state.isGameOver || state.isPaused) return state;
  
  const head = state.snake[0];
  const newHead = getNextHead(head, state.direction, state.mode);
  
  // Check wall collision in walls mode
  if (state.mode === 'walls' && checkWallCollision(newHead)) {
    return { ...state, isGameOver: true };
  }
  
  // Check self collision (exclude tail as it will move)
  const bodyWithoutTail = state.snake.slice(0, -1);
  if (checkSelfCollision(newHead, bodyWithoutTail)) {
    return { ...state, isGameOver: true };
  }
  
  const newSnake = [newHead, ...state.snake];
  let newFood = state.food;
  let newScore = state.score;
  let newSpeed = state.speed;
  
  // Check if food is eaten
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    newFood = generateFood(newSnake);
    newScore += 10;
    // Increase speed every 50 points
    if (newScore % 50 === 0 && newSpeed > 50) {
      newSpeed -= 10;
    }
  } else {
    newSnake.pop();
  }
  
  return {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
    speed: newSpeed,
  };
}

export function changeDirection(currentDirection: Direction, newDirection: Direction): Direction {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  
  if (opposites[currentDirection] === newDirection) {
    return currentDirection;
  }
  
  return newDirection;
}

export function getDirectionFromKey(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'UP';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'DOWN';
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'LEFT';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'RIGHT';
    default:
      return null;
  }
}

// AI logic for spectator mode - simple but entertaining
export function getAIDirection(state: GameState): Direction {
  const head = state.snake[0];
  const food = state.food;
  const possibleDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  
  // Remove opposite direction
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  const validDirections = possibleDirections.filter(d => d !== opposites[state.direction]);
  
  // Check which directions are safe
  const safeDirections = validDirections.filter(direction => {
    const nextHead = getNextHead(head, direction, state.mode);
    
    if (state.mode === 'walls' && checkWallCollision(nextHead)) {
      return false;
    }
    
    return !checkSelfCollision(nextHead, state.snake.slice(0, -1));
  });
  
  if (safeDirections.length === 0) {
    return state.direction;
  }
  
  // Prefer direction towards food
  const towardsFood = safeDirections.filter(direction => {
    switch (direction) {
      case 'UP': return food.y < head.y;
      case 'DOWN': return food.y > head.y;
      case 'LEFT': return food.x < head.x;
      case 'RIGHT': return food.x > head.x;
    }
  });
  
  if (towardsFood.length > 0) {
    return towardsFood[Math.floor(Math.random() * towardsFood.length)];
  }
  
  return safeDirections[Math.floor(Math.random() * safeDirections.length)];
}
