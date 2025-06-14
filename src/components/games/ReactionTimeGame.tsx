import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Zap } from 'lucide-react';

const ReactionTimeGame: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'clicked' | 'tooEarly'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('bestReactionTime');
    if (saved) {
      setBestTime(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('bestReactionTime', bestTime.toString());
    }
  }, [bestTime]);

  const startGame = () => {
    setGameState('ready');
    setReactionTime(null);
    
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    
    setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    const now = Date.now();
    
    switch (gameState) {
      case 'waiting':
        startGame();
        break;
      case 'ready':
        setGameState('tooEarly');
        break;
      case 'go':
        const time = now - startTime;
        setReactionTime(time);
        setAttempts(prev => [...prev, time]);
        setGameState('clicked');
        
        if (bestTime === null || time < bestTime) {
          setBestTime(time);
        }
        break;
      case 'clicked':
      case 'tooEarly':
        setGameState('waiting');
        break;
    }
  };

  const resetStats = () => {
    setBestTime(null);
    setAttempts([]);
    localStorage.removeItem('bestReactionTime');
    setGameState('waiting');
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return null;
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-red-500';
      case 'go':
        return 'bg-green-500';
      case 'clicked':
        return 'bg-yellow-500';
      case 'tooEarly':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting':
        return 'Click to start';
      case 'ready':
        return 'Wait for green...';
      case 'go':
        return 'CLICK NOW!';
      case 'clicked':
        return `${reactionTime}ms - Click to try again`;
      case 'tooEarly':
        return 'Too early! Click to try again';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">Best: {bestTime ? `${bestTime}ms` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="font-bold">Avg: {getAverageTime() ? `${getAverageTime()}ms` : 'N/A'}</span>
          </div>
        </div>
        <button
          onClick={resetStats}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div
        onClick={handleClick}
        className={`w-80 h-80 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-white text-center ${getBackgroundColor()} hover:opacity-90 transform hover:scale-105 shadow-lg`}
      >
        <div>
          <div className="text-2xl font-bold mb-2">{getMessage()}</div>
          {gameState === 'ready' && (
            <div className="text-sm opacity-75">Don't click yet!</div>
          )}
          {gameState === 'go' && (
            <div className="text-sm opacity-75">React as fast as you can!</div>
          )}
        </div>
      </div>

      {reactionTime && (
        <div className="text-center bg-white p-4 rounded-lg shadow-lg border">
          <h3 className="text-lg font-bold mb-2">Reaction Time: {reactionTime}ms</h3>
          <div className="text-sm text-gray-600">
            {reactionTime < 200 && '🚀 Lightning fast!'}
            {reactionTime >= 200 && reactionTime < 300 && '⚡ Very quick!'}
            {reactionTime >= 300 && reactionTime < 400 && '👍 Good reflexes!'}
            {reactionTime >= 400 && reactionTime < 500 && '👌 Not bad!'}
            {reactionTime >= 500 && '🐌 Keep practicing!'}
          </div>
        </div>
      )}

      {attempts.length > 0 && (
        <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Recent Attempts ({attempts.length}):</h4>
          <div className="flex flex-wrap gap-2">
            {attempts.slice(-10).map((time, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-sm ${
                  time === bestTime 
                    ? 'bg-yellow-200 text-yellow-800' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {time}ms
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-gray-600">
        <p className="text-sm">Test your reaction time by clicking when the screen turns green</p>
        <p className="text-xs">Wait for the color to change, then click as fast as you can!</p>
      </div>
    </div>
  );
};

export default ReactionTimeGame;