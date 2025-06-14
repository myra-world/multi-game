import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Target } from 'lucide-react';

const NumberGuessingGame: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [guessHistory, setGuessHistory] = useState<number[]>([]);
  const [range, setRange] = useState({ min: 1, max: 100 });

  const initializeGame = () => {
    const newTarget = Math.floor(Math.random() * range.max) + range.min;
    setTargetNumber(newTarget);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameWon(false);
    setGuessHistory([]);
  };

  useEffect(() => {
    initializeGame();
  }, [range]);

  const handleGuess = () => {
    const guessNumber = parseInt(guess);
    
    if (isNaN(guessNumber) || guessNumber < range.min || guessNumber > range.max) {
      setFeedback(`Please enter a number between ${range.min} and ${range.max}`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuessHistory(prev => [...prev, guessNumber]);

    if (guessNumber === targetNumber) {
      setGameWon(true);
      setFeedback(`🎉 Congratulations! You guessed it in ${newAttempts} attempts!`);
    } else if (guessNumber < targetNumber) {
      setFeedback('📈 Too low! Try a higher number.');
    } else {
      setFeedback('📉 Too high! Try a lower number.');
    }

    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const getDifficultyColor = () => {
    if (range.max <= 50) return 'text-green-600';
    if (range.max <= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyName = () => {
    if (range.max <= 50) return 'Easy';
    if (range.max <= 100) return 'Medium';
    return 'Hard';
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-bold">Attempts: {attempts}</span>
          </div>
          <div className={`flex items-center gap-2 ${getDifficultyColor()}`}>
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{getDifficultyName()}</span>
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

      <div className="text-center bg-gray-50 p-6 rounded-lg w-full">
        <h3 className="text-xl font-bold mb-2">Guess the Number!</h3>
        <p className="text-gray-600 mb-4">
          I'm thinking of a number between {range.min} and {range.max}
        </p>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setRange({ min: 1, max: 50 })}
            className={`px-3 py-1 rounded text-sm ${range.max === 50 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Easy (1-50)
          </button>
          <button
            onClick={() => setRange({ min: 1, max: 100 })}
            className={`px-3 py-1 rounded text-sm ${range.max === 100 ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            Medium (1-100)
          </button>
          <button
            onClick={() => setRange({ min: 1, max: 500 })}
            className={`px-3 py-1 rounded text-sm ${range.max === 500 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Hard (1-500)
          </button>
        </div>

        {!gameWon && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={range.min}
              max={range.max}
            />
            <button
              onClick={handleGuess}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Guess
            </button>
          </div>
        )}

        {feedback && (
          <div className={`p-3 rounded-lg mb-4 ${
            gameWon ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      {guessHistory.length > 0 && (
        <div className="w-full bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Your Guesses:</h4>
          <div className="flex flex-wrap gap-2">
            {guessHistory.map((historyGuess, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-sm ${
                  historyGuess === targetNumber 
                    ? 'bg-green-200 text-green-800' 
                    : historyGuess < targetNumber 
                      ? 'bg-red-200 text-red-800' 
                      : 'bg-blue-200 text-blue-800'
                }`}
              >
                {historyGuess}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-gray-600">
        <p className="text-sm">Enter a number and click Guess or press Enter</p>
        <p className="text-xs">Try to guess the number in as few attempts as possible!</p>
      </div>
    </div>
  );
};

export default NumberGuessingGame;