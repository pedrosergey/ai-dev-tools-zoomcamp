export type GameMode = 'walls' | 'pass-through';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  mode: GameMode;
  speed: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  date: string;
}

export interface GameSession {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  isLive: boolean;
}
