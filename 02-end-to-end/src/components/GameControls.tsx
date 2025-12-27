import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  onDirection: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

export function GameControls({ onDirection }: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2 md:hidden">
      <p className="text-xs text-muted-foreground mb-2">Touch Controls</p>
      <div className="grid grid-cols-3 gap-2 w-36">
        <div />
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12"
          onClick={() => onDirection('UP')}
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
        <div />
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12"
          onClick={() => onDirection('LEFT')}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12"
          onClick={() => onDirection('DOWN')}
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12"
          onClick={() => onDirection('RIGHT')}
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
