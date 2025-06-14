import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Shuffle } from 'lucide-react';

const WORDS = [
  'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'KEYBOARD', 'MONITOR', 'INTERNET',
  'WEBSITE', 'BROWSER', 'CODING', 'PROGRAM', 'FUNCTION', 'VARIABLE',
  'ALGORITHM', 'DATABASE', 'NETWORK', 'SOFTWARE', 'HARDWARE', 'MOBILE',
  'TABLET', 'LAPTOP', 'DESKTOP', 'GAMING', 'PUZZLE', 'CHALLENGE'
];

const WordScrambleGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generateNewWord = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    let scrambled = scrambleWord(word);
    
    // Make sure scrambled word is different from original
    while (scrambled === word) {
      scrambled = scrambleWord(word);
    }
    
    setCurrentWord(word);
    setScrambledWord(scrambled);
    setUserGuess('');
    setFeedback('');
    generateHint(word);
  };

  const generateHint = (word: string) => {
    const hints: { [key: string]: string } = {
      'JAVASCRIPT': 'A popular programming language for web development',
      'PYTHON': 'A programming language named after a snake',
      'COMPUTER': 'An electronic device for processing data',
      'KEYBOARD': 'Input device with keys for typing',
      'MONITOR': 'Display screen for computers',
      'INTERNET': 'Global network connecting computers',
      'WEBSITE': 'Collection of web pages',
      'BROWSER': 'Software for accessing websites',
      'CODING': 'Writing computer programs',
      'PROGRAM': 'Set of instructions for a computer',
      'FUNCTION': 'Reusable block of code',
      'VARIABLE': 'Storage location with a name',
      'ALGORITHM': 'Step-by-step problem-solving procedure',
      'DATABASE': 'Organized collection of data',
      'NETWORK': 'Connected group of computers',
      'SOFTWARE': 'Computer programs and applications',
      'HARDWARE': 'Physical components of a computer',
      'MOBILE': 'Portable electronic device',
      'TABLET': 'Flat, portable computer',
      'LAPTOP': 'Portable computer',
      'DESKTOP': 'Stationary computer',
      'GAMING': 'Playing video games',
      'PUZZLE': 'Problem to be solved',
      'CHALLENGE': 'Difficult task or problem'
    };
    
    setHint(hints[word] || `${word.length} letter word`);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    generateNewWord();
  };

  const handleGuess = () => {
    if (userGuess.toUpperCase() === currentWord) {
      const points = 10 + (streak * 2);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback(`🎉 Correct! +${points} points`);
      
      setTimeout(() => {
        generateNewWord();
      }, 1500);
    } else {
      setStreak(0);
      setFeedback('❌ Try again!');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const reshuffleWord = () => {
    let newScrambled = scrambleWord(currentWord);
    while (newScrambled === scrambledWord || newScrambled === currentWord) {
      newScrambled = scrambleWord(currentWord);
    }
    setScrambledWord(newScrambled);
  };

  useEffect(() => {
    if (!gameStarted) {
      generateNewWord();
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">Score: {score}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-bold">🔥 {streak}</span>
            </div>
          )}
        </div>
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {gameStarted ? 'Restart' : 'Start'}
        </button>
      </div>

      {!gameStarted && (
        <div className="text-center bg-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Word Scramble</h3>
          <p className="text-blue-700 mb-4">Unscramble the letters to form a word!</p>
          <p className="text-sm text-blue-600">Build streaks for bonus points</p>
        </div>
      )}

      {gameStarted && (
        <div className="w-full space-y-4">
          <div className="text-center bg-white p-6 rounded-lg shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Unscramble this word:</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4 tracking-wider">
              {scrambledWord}
            </div>
            <button
              onClick={reshuffleWord}
              className="flex items-center gap-2 mx-auto px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              <Shuffle className="w-4 h-4" />
              Reshuffle
            </button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> {hint}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              maxLength={currentWord.length}
            />
            <button
              onClick={handleGuess}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Guess
            </button>
          </div>

          {feedback && (
            <div className={`text-center p-3 rounded-lg font-semibold ${
              feedback.includes('🎉') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {feedback}
            </div>
          )}
        </div>
      )}

      <div className="text-center text-gray-600">
        <p className="text-sm">Rearrange the scrambled letters to form a word</p>
        <p className="text-xs">Use the hint if you get stuck!</p>
      </div>
    </div>
  );
};

export default WordScrambleGame;