import React, { useEffect, useState } from 'react';
import { leaderboardApi } from '@/lib/api';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeaderboardProps {
  onClose?: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await leaderboardApi.getLeaderboard(
          filter === 'all' ? undefined : filter
        );
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, [filter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-pixel text-2xl neon-text">Leaderboard</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'neon' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'walls' ? 'neon' : 'outline'}
          size="sm"
          onClick={() => setFilter('walls')}
          className={filter === 'walls' ? '' : 'border-destructive text-destructive hover:bg-destructive/10'}
        >
          Walls
        </Button>
        <Button
          variant={filter === 'pass-through' ? 'neon' : 'outline'}
          size="sm"
          onClick={() => setFilter('pass-through')}
          className={filter === 'pass-through' ? '' : 'border-neon-blue text-neon-blue hover:bg-neon-blue/10'}
        >
          Pass-through
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-destructive text-center">
          {error}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground">
          No scores yet. Play the game to appear on the leaderboard!
        </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden neon-box">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Rank</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Player</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Mode</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Score</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${
                    index < 3 ? 'bg-muted/20' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${index < 3 ? 'text-primary' : ''}`}>
                      {entry.username}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.mode === 'walls'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-neon-blue/20 text-neon-blue'
                      }`}
                    >
                      {entry.mode === 'walls' ? 'Walls' : 'Pass-through'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-pixel text-sm text-primary">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                    {entry.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
