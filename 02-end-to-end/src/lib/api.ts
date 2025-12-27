// Centralized mock API layer
// All backend calls go through here for easy migration to real backend

import { User, LeaderboardEntry, GameSession, AuthResponse } from '@/types/game';

// Simulated delay for realistic async behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (in-memory)
let currentUser: User | null = null;
const users: Map<string, { user: User; password: string }> = new Map();

// Initialize with some mock users
users.set('player1@snake.io', { 
  user: { id: '1', username: 'SnakeMaster', email: 'player1@snake.io' }, 
  password: 'password123' 
});
users.set('player2@snake.io', { 
  user: { id: '2', username: 'VenomStrike', email: 'player2@snake.io' }, 
  password: 'password123' 
});

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'SnakeMaster', score: 2450, mode: 'walls', date: '2024-01-15' },
  { id: '2', username: 'VenomStrike', score: 2100, mode: 'pass-through', date: '2024-01-14' },
  { id: '3', username: 'CobraKing', score: 1890, mode: 'walls', date: '2024-01-13' },
  { id: '4', username: 'PythonPro', score: 1750, mode: 'pass-through', date: '2024-01-12' },
  { id: '5', username: 'ViperQueen', score: 1620, mode: 'walls', date: '2024-01-11' },
  { id: '6', username: 'SerpentLord', score: 1500, mode: 'pass-through', date: '2024-01-10' },
  { id: '7', username: 'SlitherKing', score: 1380, mode: 'walls', date: '2024-01-09' },
  { id: '8', username: 'NightCrawler', score: 1250, mode: 'pass-through', date: '2024-01-08' },
  { id: '9', username: 'ToxicBite', score: 1100, mode: 'walls', date: '2024-01-07' },
  { id: '10', username: 'ScaleRunner', score: 980, mode: 'pass-through', date: '2024-01-06' },
];

// Mock active game sessions for spectating
const mockActiveSessions: GameSession[] = [
  { id: '1', username: 'LivePlayer1', score: 340, mode: 'walls', isLive: true },
  { id: '2', username: 'StreamerPro', score: 520, mode: 'pass-through', isLive: true },
  { id: '3', username: 'NightGamer', score: 180, mode: 'walls', isLive: true },
];

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500);
    
    const userData = users.get(email);
    if (!userData || userData.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    currentUser = userData.user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { success: true, user: currentUser };
  },

  async signup(email: string, username: string, password: string): Promise<AuthResponse> {
    await delay(500);
    
    if (users.has(email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    const existingUsernames = Array.from(users.values()).map(u => u.user.username);
    if (existingUsernames.includes(username)) {
      return { success: false, error: 'Username already taken' };
    }
    
    const newUser: User = {
      id: String(users.size + 1),
      username,
      email,
    };
    
    users.set(email, { user: newUser, password });
    currentUser = newUser;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { success: true, user: currentUser };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('snake_user');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem('snake_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    
    return null;
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: 'walls' | 'pass-through'): Promise<LeaderboardEntry[]> {
    await delay(300);
    
    if (mode) {
      return mockLeaderboard.filter(entry => entry.mode === mode);
    }
    return mockLeaderboard;
  },

  async submitScore(score: number, mode: 'walls' | 'pass-through'): Promise<{ success: boolean; rank?: number }> {
    await delay(400);
    
    if (!currentUser) {
      return { success: false };
    }
    
    const newEntry: LeaderboardEntry = {
      id: String(mockLeaderboard.length + 1),
      username: currentUser.username,
      score,
      mode,
      date: new Date().toISOString().split('T')[0],
    };
    
    mockLeaderboard.push(newEntry);
    mockLeaderboard.sort((a, b) => b.score - a.score);
    
    const rank = mockLeaderboard.findIndex(e => e.id === newEntry.id) + 1;
    return { success: true, rank };
  },
};

// Game sessions API (for spectating)
export const gameSessionsApi = {
  async getActiveSessions(): Promise<GameSession[]> {
    await delay(300);
    return mockActiveSessions;
  },

  async getSessionById(id: string): Promise<GameSession | null> {
    await delay(200);
    return mockActiveSessions.find(s => s.id === id) || null;
  },
};
