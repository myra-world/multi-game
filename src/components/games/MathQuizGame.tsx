import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Clock, Calculator } from 'lucide-react';

interface Question {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
}

const MathQuizGame: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = () => {
    let num1: number, num2: number, operator: string, answer: number;

    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1];
        answer = operator === '+' ? num1 + num2 : num1 - num2;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        operator = ['×', '÷'][Math.floor(Math.random() * 2)];
        if (operator === '×') {
          answer = num1 * num2;
        } else {
          answer = num1;
          num1 = answer * num2;
        }
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        const operations = ['+', '-', '×'];
        operator = operations[Math.floor(Math.random() * operations.length)];
        switch (operator) {
          case '+':
            answer = num1 + num2;
            break;
          case '-':
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            break;
          case '×':
            answer = num1 * num2;
            break;
          default:
            answer = 0;
        }
        break;
      default:
        num1 = num2 = answer = 0;
        operator = '+';
    }

    setQuestion({ num1, num2, operator, answer });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setFeedback('');
    setStreak(0);
    setQuestionsAnswered(0);
    generateQuestion();
  };

  const handleAnswer = () => {
    if (!question || !gameActive) return;

    const userNum = parseInt(userAnswer);
    if (isNaN(userNum)) return;

    setQuestionsAnswered(prev => prev + 1);

    if (userNum === question.answer) {
      const points = (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15) + streak;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback(`✅ Correct! +${points} points`);
    } else {
      setStreak(0);
      setFeedback(`❌ Wrong! Answer was ${question.answer}`);
    }

    setUserAnswer('');
    setTimeout(() => {
      generateQuestion();
      setFeedback('');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswer();
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

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <div className="flex items-center justify-between w-full">
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
          {gameActive ? 'Restart' : 'Start'}
        </button>
      </div>

      <div className="flex gap-2 w-full">
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
              difficulty === level
                ? level === 'easy' ? 'bg-green-500 text-white' :
                  level === 'medium' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {streak > 0 && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-2">
          <span className="text-orange-800 font-bold">🔥 Streak: {streak}</span>
        </div>
      )}

      {!gameActive && timeLeft === 0 && (
        <div className="text-center bg-blue-100 p-4 rounded-lg border-2 border-blue-300 w-full">
          <h3 className="text-2xl font-bold text-blue-800 mb-2">Time's Up! 📊</h3>
          <p className="text-blue-700">Final Score: {score}</p>
          <p className="text-blue-600 text-sm">Questions Answered: {questionsAnswered}</p>
        </div>
      )}

      {!gameActive && timeLeft === 60 && (
        <div className="text-center bg-purple-100 p-6 rounded-lg w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-800">Math Quiz</h3>
          </div>
          <p className="text-purple-700 mb-2">Solve as many math problems as you can!</p>
          <p className="text-sm text-purple-600">Choose your difficulty level and start</p>
        </div>
      )}

      {question && gameActive && (
        <div className="w-full space-y-4">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg border">
            <div className={`text-sm font-medium mb-2 ${getDifficultyColor()}`}>
              {difficulty.toUpperCase()} MODE
            </div>
            <div className="text-5xl font-bold text-gray-800 mb-4">
              {question.num1} {question.operator} {question.num2} = ?
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your answer"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center"
            />
            <button
              onClick={handleAnswer}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Submit
            </button>
          </div>

          {feedback && (
            <div className={`text-center p-3 rounded-lg font-semibold ${
              feedback.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {feedback}
            </div>
          )}
        </div>
      )}

      <div className="text-center text-gray-600">
        <p className="text-sm">Solve math problems as quickly as possible</p>
        <p className="text-xs">Build streaks for bonus points!</p>
      </div>
    </div>
  );
};

export default MathQuizGame;