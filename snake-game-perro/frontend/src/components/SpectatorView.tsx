import React, { useEffect, useState, useRef } from 'react';
import { gameSessionsApi } from '@/lib/api';
import { GameSession, GameState, GameMode } from '@/types/game';
import { GameBoard } from './GameBoard';
import { Button } from '@/components/ui/button';
import { 
  createInitialState, 
  moveSnake, 
  getAIDirection, 
  changeDirection 
} from '@/lib/gameLogic';
import { Eye, Users, ArrowLeft, Radio, Loader2 } from 'lucide-react';

interface SpectatorViewProps {
  onBack: () => void;
  onWatchingChange?: (isWatching: boolean) => void;
}

export function SpectatorView({ onBack, onWatchingChange }: SpectatorViewProps) {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatedState, setSimulatedState] = useState<GameState | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      const data = await gameSessionsApi.getActiveSessions();
      setSessions(data);
      setIsLoading(false);
    };
    loadSessions();

    // Refresh sessions periodically
    const refreshInterval = setInterval(loadSessions, 10000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Simulate AI gameplay for selected session
  useEffect(() => {
    if (!selectedSession) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSimulatedState(null);
      onWatchingChange?.(false);
      return;
    }

    onWatchingChange?.(true);

    // Initialize game state for AI
    const initialState = createInitialState(selectedSession.mode);
    setSimulatedState(initialState);

    // Run AI game loop
    intervalRef.current = setInterval(() => {
      setSimulatedState((prev) => {
        if (!prev || prev.isGameOver) {
          // Restart game after game over
          return createInitialState(selectedSession.mode);
        }

        // Get AI direction
        const newDirection = getAIDirection(prev);
        const stateWithNewDirection = {
          ...prev,
          direction: changeDirection(prev.direction, newDirection),
        };

        // Move snake
        return moveSnake(stateWithNewDirection);
      });
    }, 120);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedSession, onWatchingChange]);

  if (selectedSession && simulatedState) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectedSession(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to list
          </Button>
          <div className="flex-1 flex items-center gap-3">
            <Radio className="w-4 h-4 text-destructive animate-pulse" />
            <span className="font-medium">Watching: {selectedSession.username}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedSession.mode === 'walls'
                ? 'bg-destructive/20 text-destructive'
                : 'bg-neon-blue/20 text-neon-blue'
            }`}>
              {selectedSession.mode === 'walls' ? 'Walls' : 'Pass-through'}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GameBoard
            mode={selectedSession.mode}
            isSpectating={true}
            spectatorState={simulatedState}
          />
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>You are watching a live game session (simulated)</p>
          <p>Viewers: {Math.floor(Math.random() * 50) + 10}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="font-pixel text-2xl neon-text-accent flex items-center gap-3">
          <Eye className="w-6 h-6" />
          Live Games
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No live games right now</p>
          <p className="text-sm mt-2">Check back later or start your own game!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="w-full p-4 bg-card rounded-lg border border-border hover:border-accent/50 transition-all group text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Radio className="w-5 h-5 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg group-hover:text-accent transition-colors">
                      {session.username}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          session.mode === 'walls'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-neon-blue/20 text-neon-blue'
                        }`}
                      >
                        {session.mode === 'walls' ? 'Walls' : 'Pass-through'}
                      </span>
                      <span>•</span>
                      <span>Score: {session.score}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 50) + 10} watching</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
