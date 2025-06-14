import React, { useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

type Player = 'X' | 'O' | null;

const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: Player[]): Player => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell !== null) ? 'draw' : null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameResult === 'draw') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setScores(prev => ({ ...prev, [gameResult]: prev[gameResult] + 1 }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span className="font-bold">X: {scores.X}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-500" />
            <span className="font-bold">O: {scores.O}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-600">Draws: {scores.draws}</span>
          </div>
        </div>
        <button
          onClick={resetScores}
          className="flex items-center gap-2 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      <div className="text-center">
        {winner ? (
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
            </h3>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        ) : (
          <h3 className="text-xl font-semibold">
            Current Player: <span className={currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500'}>{currentPlayer}</span>
          </h3>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-gray-200 p-4 rounded-lg">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className={`w-20 h-20 bg-white border-2 border-gray-300 rounded-lg text-3xl font-bold transition-all hover:bg-gray-50 ${
              cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : ''
            } ${winner ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={!!winner || !!cell}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="text-center text-gray-600">
        <p className="text-sm">Click on any empty cell to make your move</p>
        <p className="text-xs">First to get three in a row wins!</p>
      </div>
    </div>
  );
};

export default TicTacToeGame;