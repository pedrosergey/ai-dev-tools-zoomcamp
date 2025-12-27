import React from 'react';
import { GameMode } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';

interface ModeSelectorProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground">Game Mode</h3>
      <div className="flex gap-3">
        <Button
          variant={mode === 'walls' ? 'default' : 'outline'}
          onClick={() => onChange('walls')}
          className={`flex-1 gap-2 ${
            mode === 'walls'
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
              : 'border-destructive text-destructive hover:bg-destructive/10'
          }`}
        >
          <Shield className="w-4 h-4" />
          Walls
        </Button>
        <Button
          variant={mode === 'pass-through' ? 'default' : 'outline'}
          onClick={() => onChange('pass-through')}
          className={`flex-1 gap-2 ${
            mode === 'pass-through'
              ? 'bg-neon-blue hover:bg-neon-blue/90 text-background'
              : 'border-neon-blue text-neon-blue hover:bg-neon-blue/10'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Pass-through
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {mode === 'walls'
          ? 'Hit a wall and the game is over!'
          : 'Pass through walls and appear on the other side.'}
      </p>
    </div>
  );
}
