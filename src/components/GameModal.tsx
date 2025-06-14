import React from 'react';
import { X } from 'lucide-react';
import { Game } from '../types/Game';
import SnakeGame from './games/SnakeGame';
import TicTacToeGame from './games/TicTacToeGame';
import MemoryGame from './games/MemoryGame';
import NumberGuessingGame from './games/NumberGuessingGame';
import ColorMatchGame from './games/ColorMatchGame';
import ReactionTimeGame from './games/ReactionTimeGame';
import WordScrambleGame from './games/WordScrambleGame';
import MathQuizGame from './games/MathQuizGame';

interface GameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderGame = () => {
    switch (game.id) {
      case '1':
        return <SnakeGame />;
      case '2':
        return <TicTacToeGame />;
      case '3':
        return <MemoryGame />;
      case '4':
        return <NumberGuessingGame />;
      case '5':
        return <ColorMatchGame />;
      case '6':
        return <ReactionTimeGame />;
      case '7':
        return <WordScrambleGame />;
      case '8':
        return <MathQuizGame />;
      default:
        return <div className="text-center py-8">Game not found</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className={`bg-gradient-to-r ${game.color} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                {game.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{game.name}</h2>
                <p className="text-white text-opacity-90">{game.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};

export default GameModal;