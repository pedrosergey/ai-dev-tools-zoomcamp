import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { GameMode } from '@/types/game';
import { Header } from '@/components/Header';
import { GameBoard } from '@/components/GameBoard';
import { ModeSelector } from '@/components/ModeSelector';
import { Leaderboard } from '@/components/Leaderboard';
import { SpectatorView } from '@/components/SpectatorView';
import { useAuth } from '@/contexts/AuthContext';
import { leaderboardApi } from '@/lib/api';
import { toast } from 'sonner';
import { Keyboard, Gamepad2 } from 'lucide-react';

type View = 'game' | 'leaderboard' | 'spectator' | 'watching';

const Index = () => {
  const [mode, setMode] = useState<GameMode>('walls');
  const [view, setView] = useState<View>('game');
  const { user } = useAuth();

  const handleGameOver = async (score: number) => {
    if (user && score > 0) {
      const result = await leaderboardApi.submitScore(score, mode);
      if (result.success && result.rank) {
        toast.success(`Score submitted! You ranked #${result.rank}`);
      }
    }
  };

  const renderView = () => {
    switch (view) {
      case 'leaderboard':
        return (
          <div className="w-full px-4 py-8">
            <Leaderboard onClose={() => setView('game')} />
          </div>
        );
      case 'spectator':
      case 'watching':
        return (
          <div className="w-full px-4 py-8">
            <SpectatorView onBack={() => setView('game')} onWatchingChange={(isWatching) => setView(isWatching ? 'watching' : 'spectator')} />
          </div>
        );
      default:
        return (
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 p-4 md:p-8">
            <div className="order-1 lg:order-1">
              <GameBoard mode={mode} onGameOver={handleGameOver} />
            </div>

            <div className="order-2 lg:order-2 w-full lg:w-auto flex flex-col gap-6">
              <ModeSelector mode={mode} onChange={setMode} />
              
              <div className="hidden md:block p-4 bg-card rounded-lg border border-border">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Controls
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">↑ ↓ ← →</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">WASD</kbd> to move</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">Space</kbd> to pause</li>
                  <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">R</kbd> to restart</li>
                </ul>
              </div>

              {!user && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <p className="text-sm text-accent font-medium mb-1">
                    Sign in to save scores!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create an account to appear on the leaderboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Snake Arena - Classic Snake Game with Multiplayer</title>
        <meta 
          name="description" 
          content="Play the classic Snake game with two modes: walls and pass-through. Compete on the leaderboard and watch other players live!" 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          onShowLeaderboard={() => setView('leaderboard')}
          onShowSpectator={() => setView('spectator')}
          onGoHome={() => setView('game')}
          isWatchingGame={view === 'watching'}
        />
        
        <main className="flex-1 flex flex-col items-center">
          {view === 'game' && (
            <div className="py-6 text-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-card rounded-full border border-border">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Ready to play?</span>
              </div>
            </div>
          )}
          
          {renderView()}
        </main>

        <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
          <p>Snake Arena © 2024 - A multiplayer snake game</p>
        </footer>
      </div>
    </>
  );
};

export default Index;
