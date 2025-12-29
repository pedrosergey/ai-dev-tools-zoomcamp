import { User, LeaderboardEntry, GameSession, AuthResponse, GameMode } from '@/types/game';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

async function handleJSON<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.detail || json.error || JSON.stringify(json));
    } catch {
      throw new Error(text || res.statusText);
    }
  }
  return res.json();
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await handleJSON<AuthResponse>(res);
    if (result.success && result.user) {
      localStorage.setItem('snake_user', JSON.stringify(result.user));
    }
    return result;
  },

  async signup(email: string, username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const result = await handleJSON<AuthResponse>(res);
    if (result.success && result.user) {
      localStorage.setItem('snake_user', JSON.stringify(result.user));
    }
    return result;
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    localStorage.removeItem('snake_user');
  },

  async getCurrentUser(): Promise<User | null> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (res.status === 401) return null;
    return handleJSON<User>(res);
  },
};

export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
    const url = new URL(`${API_BASE}/leaderboard`);
    if (mode) url.searchParams.set('mode', mode);
    const res = await fetch(url.toString());
    return handleJSON<LeaderboardEntry[]>(res);
  },

  async submitScore(score: number, mode: GameMode, username?: string): Promise<{ success: boolean; rank?: number }> {
    // Get username from localStorage if not provided
    const user = username || (() => {
      const stored = localStorage.getItem('snake_user');
      return stored ? JSON.parse(stored).username : 'Unknown';
    })();

    const res = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, mode, username: user }),
    });
    return handleJSON<{ success: boolean; rank?: number }>(res);
  },
};

export const gameSessionsApi = {
  async getActiveSessions(): Promise<GameSession[]> {
    const res = await fetch(`${API_BASE}/sessions`);
    return handleJSON<GameSession[]>(res);
  },

  async getSessionById(id: string): Promise<GameSession | null> {
    const res = await fetch(`${API_BASE}/sessions/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    return handleJSON<GameSession>(res);
  },
};
