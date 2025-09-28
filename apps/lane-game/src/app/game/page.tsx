import { GameInterface } from '@/components/GameInterface';
import { GameProvider } from '@/lib/game-store';

export default function GamePage() {
  return (
    <GameProvider>
      <GameInterface />
    </GameProvider>
  );
}
