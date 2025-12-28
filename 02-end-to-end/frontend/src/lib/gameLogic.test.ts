import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getNextHead,
  checkWallCollision,
  checkSelfCollision,
  moveSnake,
  changeDirection,
  getDirectionFromKey,
  getAIDirection,
  GRID_SIZE,
} from './gameLogic';
import { Direction, GameState, Position } from '@/types/game';

describe('createInitialState', () => {
  it('should create initial state for walls mode', () => {
    const state = createInitialState('walls');
    expect(state.mode).toBe('walls');
    expect(state.snake.length).toBe(3);
    expect(state.isGameOver).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.score).toBe(0);
    expect(state.direction).toBe('RIGHT');
  });

  it('should create initial state for pass-through mode', () => {
    const state = createInitialState('pass-through');
    expect(state.mode).toBe('pass-through');
  });

  it('should have food not on snake', () => {
    const state = createInitialState('walls');
    const foodOnSnake = state.snake.some(
      s => s.x === state.food.x && s.y === state.food.y
    );
    expect(foodOnSnake).toBe(false);
  });
});

describe('generateFood', () => {
  it('should generate food not on snake', () => {
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    const food = generateFood(snake);
    const foodOnSnake = snake.some(s => s.x === food.x && s.y === food.y);
    expect(foodOnSnake).toBe(false);
  });

  it('should generate food within grid bounds', () => {
    const snake: Position[] = [{ x: 0, y: 0 }];
    const food = generateFood(snake);
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(GRID_SIZE);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(GRID_SIZE);
  });
});

describe('getNextHead', () => {
  it('should move up correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'UP', 'walls');
    expect(next).toEqual({ x: 5, y: 4 });
  });

  it('should move down correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'DOWN', 'walls');
    expect(next).toEqual({ x: 5, y: 6 });
  });

  it('should move left correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'LEFT', 'walls');
    expect(next).toEqual({ x: 4, y: 5 });
  });

  it('should move right correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'RIGHT', 'walls');
    expect(next).toEqual({ x: 6, y: 5 });
  });

  it('should wrap around in pass-through mode (left edge)', () => {
    const head: Position = { x: 0, y: 5 };
    const next = getNextHead(head, 'LEFT', 'pass-through');
    expect(next).toEqual({ x: GRID_SIZE - 1, y: 5 });
  });

  it('should wrap around in pass-through mode (right edge)', () => {
    const head: Position = { x: GRID_SIZE - 1, y: 5 };
    const next = getNextHead(head, 'RIGHT', 'pass-through');
    expect(next).toEqual({ x: 0, y: 5 });
  });

  it('should wrap around in pass-through mode (top edge)', () => {
    const head: Position = { x: 5, y: 0 };
    const next = getNextHead(head, 'UP', 'pass-through');
    expect(next).toEqual({ x: 5, y: GRID_SIZE - 1 });
  });

  it('should wrap around in pass-through mode (bottom edge)', () => {
    const head: Position = { x: 5, y: GRID_SIZE - 1 };
    const next = getNextHead(head, 'DOWN', 'pass-through');
    expect(next).toEqual({ x: 5, y: 0 });
  });

  it('should NOT wrap in walls mode', () => {
    const head: Position = { x: 0, y: 5 };
    const next = getNextHead(head, 'LEFT', 'walls');
    expect(next).toEqual({ x: -1, y: 5 });
  });
});

describe('checkWallCollision', () => {
  it('should detect left wall collision', () => {
    expect(checkWallCollision({ x: -1, y: 5 })).toBe(true);
  });

  it('should detect right wall collision', () => {
    expect(checkWallCollision({ x: GRID_SIZE, y: 5 })).toBe(true);
  });

  it('should detect top wall collision', () => {
    expect(checkWallCollision({ x: 5, y: -1 })).toBe(true);
  });

  it('should detect bottom wall collision', () => {
    expect(checkWallCollision({ x: 5, y: GRID_SIZE })).toBe(true);
  });

  it('should not detect collision within bounds', () => {
    expect(checkWallCollision({ x: 5, y: 5 })).toBe(false);
    expect(checkWallCollision({ x: 0, y: 0 })).toBe(false);
    expect(checkWallCollision({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })).toBe(false);
  });
});

describe('checkSelfCollision', () => {
  it('should detect self collision', () => {
    const body: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    expect(checkSelfCollision({ x: 5, y: 5 }, body)).toBe(true);
    expect(checkSelfCollision({ x: 4, y: 5 }, body)).toBe(true);
  });

  it('should not detect collision with different position', () => {
    const body: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ];
    expect(checkSelfCollision({ x: 6, y: 5 }, body)).toBe(false);
  });
});

describe('moveSnake', () => {
  it('should move snake forward', () => {
    const state = createInitialState('walls');
    const head = state.snake[0];
    const newState = moveSnake(state);
    expect(newState.snake[0].x).toBe(head.x + 1);
    expect(newState.snake[0].y).toBe(head.y);
    expect(newState.snake.length).toBe(state.snake.length);
  });

  it('should not move when paused', () => {
    const state = { ...createInitialState('walls'), isPaused: true };
    const newState = moveSnake(state);
    expect(newState).toBe(state);
  });

  it('should not move when game over', () => {
    const state = { ...createInitialState('walls'), isGameOver: true };
    const newState = moveSnake(state);
    expect(newState).toBe(state);
  });

  it('should grow snake and increase score when eating food', () => {
    const state = createInitialState('walls');
    const head = state.snake[0];
    // Place food directly in front of snake
    state.food = { x: head.x + 1, y: head.y };
    
    const newState = moveSnake(state);
    expect(newState.snake.length).toBe(state.snake.length + 1);
    expect(newState.score).toBe(10);
  });

  it('should end game on wall collision in walls mode', () => {
    const state = createInitialState('walls');
    state.snake[0] = { x: GRID_SIZE - 1, y: 5 };
    state.direction = 'RIGHT';
    
    const newState = moveSnake(state);
    expect(newState.isGameOver).toBe(true);
  });

  it('should not end game on edge in pass-through mode', () => {
    const state = createInitialState('pass-through');
    state.snake[0] = { x: GRID_SIZE - 1, y: 5 };
    state.direction = 'RIGHT';
    
    const newState = moveSnake(state);
    expect(newState.isGameOver).toBe(false);
    expect(newState.snake[0].x).toBe(0);
  });

  it('should end game on self collision', () => {
    const state = createInitialState('walls');
    // Create a snake that will collide with itself
    state.snake = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 4 },
      { x: 5, y: 4 },
      { x: 4, y: 4 },
    ];
    state.direction = 'UP';
    
    const newState = moveSnake(state);
    expect(newState.isGameOver).toBe(true);
  });
});

describe('changeDirection', () => {
  it('should change direction when valid', () => {
    expect(changeDirection('RIGHT', 'UP')).toBe('UP');
    expect(changeDirection('RIGHT', 'DOWN')).toBe('DOWN');
    expect(changeDirection('UP', 'LEFT')).toBe('LEFT');
    expect(changeDirection('UP', 'RIGHT')).toBe('RIGHT');
  });

  it('should not change to opposite direction', () => {
    expect(changeDirection('RIGHT', 'LEFT')).toBe('RIGHT');
    expect(changeDirection('LEFT', 'RIGHT')).toBe('LEFT');
    expect(changeDirection('UP', 'DOWN')).toBe('UP');
    expect(changeDirection('DOWN', 'UP')).toBe('DOWN');
  });
});

describe('getDirectionFromKey', () => {
  it('should return correct direction for arrow keys', () => {
    expect(getDirectionFromKey('ArrowUp')).toBe('UP');
    expect(getDirectionFromKey('ArrowDown')).toBe('DOWN');
    expect(getDirectionFromKey('ArrowLeft')).toBe('LEFT');
    expect(getDirectionFromKey('ArrowRight')).toBe('RIGHT');
  });

  it('should return correct direction for WASD keys', () => {
    expect(getDirectionFromKey('w')).toBe('UP');
    expect(getDirectionFromKey('W')).toBe('UP');
    expect(getDirectionFromKey('s')).toBe('DOWN');
    expect(getDirectionFromKey('S')).toBe('DOWN');
    expect(getDirectionFromKey('a')).toBe('LEFT');
    expect(getDirectionFromKey('A')).toBe('LEFT');
    expect(getDirectionFromKey('d')).toBe('RIGHT');
    expect(getDirectionFromKey('D')).toBe('RIGHT');
  });

  it('should return null for invalid keys', () => {
    expect(getDirectionFromKey('x')).toBe(null);
    expect(getDirectionFromKey(' ')).toBe(null);
  });
});

describe('getAIDirection', () => {
  it('should return a valid direction', () => {
    const state = createInitialState('walls');
    const direction = getAIDirection(state);
    expect(['UP', 'DOWN', 'LEFT', 'RIGHT']).toContain(direction);
  });

  it('should not return opposite direction', () => {
    const state = createInitialState('walls');
    state.direction = 'RIGHT';
    
    // Run multiple times to ensure consistency
    for (let i = 0; i < 10; i++) {
      const direction = getAIDirection(state);
      expect(direction).not.toBe('LEFT');
    }
  });

  it('should avoid wall collision in walls mode', () => {
    const state = createInitialState('walls');
    state.snake = [{ x: 0, y: 5 }, { x: 1, y: 5 }];
    state.direction = 'LEFT';
    
    // Should not return LEFT when at left edge in walls mode
    const direction = getAIDirection(state);
    expect(['UP', 'DOWN', 'RIGHT']).toContain(direction);
  });
});
