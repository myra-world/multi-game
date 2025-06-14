import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Gamepad2, 
  Sword, 
  Grid3X3, 
  Brain, 
  Target, 
  Palette, 
  Zap, 
  Type, 
  Calculator,
  Sparkles,
  Plus,
  X,
  Play
} from 'lucide-react';
import { Game } from './types/Game';
import GameModal from './components/GameModal';

const SUGGESTED_GAMES: Game[] = [
  {
    id: '1',
    name: 'Snake Game',
    icon: <Sword className="w-6 h-6" />,
    description: 'Classic snake game - eat food and grow!',
    category: 'Arcade',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '2',
    name: 'Tic Tac Toe',
    icon: <Grid3X3 className="w-6 h-6" />,
    description: 'Classic strategy game for two players',
    category: 'Strategy',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    name: 'Memory Match',
    icon: <Brain className="w-6 h-6" />,
    description: 'Test your memory with card matching',
    category: 'Puzzle',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: '4',
    name: 'Number Guessing',
    icon: <Target className="w-6 h-6" />,
    description: 'Guess the secret number in few tries',
    category: 'Logic',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '5',
    name: 'Color Match',
    icon: <Palette className="w-6 h-6" />,
    description: 'Match colors as fast as you can',
    category: 'Speed',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '6',
    name: 'Reaction Time',
    icon: <Zap className="w-6 h-6" />,
    description: 'Test your reflexes and reaction speed',
    category: 'Reflex',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '7',
    name: 'Word Scramble',
    icon: <Type className="w-6 h-6" />,
    description: 'Unscramble letters to form words',
    category: 'Word',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: '8',
    name: 'Math Quiz',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Solve math problems against the clock',
    category: 'Education',
    color: 'from-indigo-500 to-purple-500'
  }
];

function App() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [suggestedGames, setSuggestedGames] = useState<Game[]>(SUGGESTED_GAMES);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteGames');
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      setFavorites(parsedFavorites);
      
      // Remove favorites from suggested games
      const remainingSuggested = SUGGESTED_GAMES.filter(
        game => !parsedFavorites.some((fav: Game) => fav.id === game.id)
      );
      setSuggestedGames(remainingSuggested);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favoriteGames', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (game: Game) => {
    setFavorites(prev => [...prev, game]);
    setSuggestedGames(prev => prev.filter(g => g.id !== game.id));
  };

  const removeFromFavorites = (gameId: string) => {
    const gameToRemove = favorites.find(g => g.id === gameId);
    if (gameToRemove) {
      setFavorites(prev => prev.filter(g => g.id !== gameId));
      setSuggestedGames(prev => [...prev, gameToRemove].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const playGame = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const GameCard = ({ game, isFavorite = false }: { game: Game; isFavorite?: boolean }) => (
    <div className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 ${isFavorite ? 'ring-2 ring-pink-300' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} text-white mb-4 shadow-lg`}>
          {game.icon}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
          {game.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {game.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {game.category}
          </span>
          
          <button
            onClick={() => isFavorite ? removeFromFavorites(game.id) : addToFavorites(game)}
            className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
              isFavorite 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isFavorite ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={() => playGame(game)}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r ${game.color} text-white rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 font-medium`}
        >
          <Play className="w-4 h-4" />
          Play Game
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gaming Hub
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Play amazing mini-games and build your personal collection of favorites
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-yellow-400"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Favorites Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Favorites</h2>
                <p className="text-gray-600">Games you love the most</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                  {favorites.length} games
                </span>
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
                <p className="text-gray-500">Add games from the suggested list to start building your collection!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {favorites.map(game => (
                  <GameCard key={game.id} game={game} isFavorite={true} />
                ))}
              </div>
            )}
          </div>

          {/* Suggested Games Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Available Games</h2>
                <p className="text-gray-600">Discover new adventures</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {suggestedGames.length} games
                </span>
              </div>
            </div>

            {suggestedGames.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">All games added!</h3>
                <p className="text-gray-500">You've added all available games to your favorites. Great taste!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {suggestedGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600">
            Your game preferences are automatically saved. Come back anytime to play your favorite games!
          </p>
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal
          game={selectedGame}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;