import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Clock } from 'lucide-react';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_VALUES = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎵'];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const initializeGame = () => {
    const shuffledValues = [...CARD_VALUES, ...CARD_VALUES]
      .sort(() => Math.random() - 0.5);
    
    const newCards = shuffledValues.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setTime(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  useEffect(() => {
    if (matches === CARD_VALUES.length) {
      setGameWon(true);
      setIsPlaying(false);
    }
  }, [matches]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true, isFlipped: false }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">Moves: {moves}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="font-bold">{formatTime(time)}</span>
          </div>
        </div>
        <button
          onClick={initializeGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
      </div>

      {gameWon && (
        <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-300">
          <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations! 🎉</h3>
          <p className="text-green-700">
            You won in {moves} moves and {formatTime(time)}!
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 bg-gray-100 p-4 rounded-lg">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 rounded-lg text-2xl font-bold transition-all transform hover:scale-105 ${
              card.isFlipped || card.isMatched
                ? card.isMatched 
                  ? 'bg-green-200 border-2 border-green-400' 
                  : 'bg-blue-200 border-2 border-blue-400'
                : 'bg-white border-2 border-gray-300 hover:bg-gray-50'
            }`}
            disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </button>
        ))}
      </div>

      <div className="text-center text-gray-600">
        <p className="text-sm">Click cards to flip them and find matching pairs</p>
        <p className="text-xs">Match all pairs to win the game!</p>
      </div>
    </div>
  );
};

export default MemoryGame;