import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Clock } from 'lucide-react';

interface ColorChallenge {
  targetColor: string;
  options: string[];
  correctIndex: number;
}

const COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Lime', value: '#32CD32' },
  { name: 'Magenta', value: '#FF00FF' },
];

const ColorMatchGame: React.FC = () => {
  const [challenge, setChallenge] = useState<ColorChallenge | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);

  const generateChallenge = () => {
    const correctColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const wrongColors = COLORS.filter(c => c.name !== correctColor.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctColor, ...wrongColors]
      .sort(() => Math.random() - 0.5);
    
    const correctIndex = options.findIndex(c => c.name === correctColor.name);

    setChallenge({
      targetColor: correctColor.name,
      options: options.map(c => c.value),
      correctIndex
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setFeedback('');
    setStreak(0);
    generateChallenge();
  };

  const handleColorClick = (index: number) => {
    if (!challenge || !gameActive) return;

    if (index === challenge.correctIndex) {
      setScore(prev => prev + (10 + streak * 2));
      setStreak(prev => prev + 1);
      setFeedback('✅ Correct!');
      setTimeout(() => {
        generateChallenge();
        setFeedback('');
      }, 500);
    } else {
      setStreak(0);
      setFeedback('❌ Wrong color!');
      setTimeout(() => {
        generateChallenge();
        setFeedback('');
      }, 1000);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {gameActive ? 'Restart' : 'Start Game'}
        </button>
      </div>

      {streak > 0 && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2">
          <span className="text-yellow-800 font-bold">🔥 Streak: {streak}</span>
        </div>
      )}

      {!gameActive && timeLeft === 0 && (
        <div className="text-center bg-red-100 p-4 rounded-lg border-2 border-red-300">
          <h3 className="text-2xl font-bold text-red-800 mb-2">Time's Up! ⏰</h3>
          <p className="text-red-700">Final Score: {score}</p>
        </div>
      )}

      {!gameActive && timeLeft === 30 && (
        <div className="text-center bg-blue-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Color Match Challenge</h3>
          <p className="text-blue-700 mb-4">Click the color that matches the name shown above!</p>
          <p className="text-sm text-blue-600">You have 30 seconds to score as many points as possible</p>
        </div>
      )}

      {challenge && gameActive && (
        <div className="text-center space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
            <h3 className="text-3xl font-bold mb-2">Find:</h3>
            <p className="text-4xl font-bold text-gray-800">{challenge.targetColor}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {challenge.options.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(index)}
                className="w-24 h-24 rounded-lg border-4 border-gray-300 hover:border-gray-500 transition-all transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {feedback && (
            <div className={`text-xl font-bold ${
              feedback.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback}
            </div>
          )}
        </div>
      )}

      <div className="text-center text-gray-600">
        <p className="text-sm">Click on the color that matches the name shown</p>
        <p className="text-xs">Build streaks for bonus points!</p>
      </div>
    </div>
  );
};

export default ColorMatchGame;