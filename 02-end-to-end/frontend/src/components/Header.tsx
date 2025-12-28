import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';
import { User, LogOut, Trophy, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onShowLeaderboard: () => void;
  onShowSpectator: () => void;
  onGoHome: () => void;
  isWatchingGame?: boolean;
}

export function Header({ onShowLeaderboard, onShowSpectator, onGoHome, isWatchingGame }: HeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="w-full px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={onGoHome} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <h1 className="font-pixel text-xl md:text-2xl neon-text tracking-wider">
              SNAKE<span className="text-accent">ARENA</span>
            </h1>
          </button>

          <nav className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowLeaderboard}
              className="gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onShowSpectator}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Watch Live</span>
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onShowLeaderboard}>
                    <Trophy className="w-4 h-4 mr-2" />
                    My Scores
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={openLogin}>
                  Sign in
                </Button>
                <Button variant="neon" size="sm" onClick={openSignup}>
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
