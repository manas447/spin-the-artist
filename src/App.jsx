import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryWheel from './components/CategoryWheel';
import ArtistWheel from './components/ArtistWheel';
import ChallengeWheel from './components/ChallengeWheel';
import Timer from './components/Timer';
import ScoreBoard from './components/ScoreBoard';
import JokerPanel from './components/JokerPanel';
import { getRandomItems } from './utils/randomizer';
import { updateRecentArtists } from './utils/antiRepeat';
import { calculateRoundScore } from './utils/scoring';

// Import static data
import categoriesData from './data/categories.json';
import artistsData from './data/artists.json';
import challengesData from './data/challenges.json';

/**
 * Main App component - Handles entire game flow
 */
function App() {
  // Game state
  const [gameMode, setGameMode] = useState(null); // 'solo' or 'party'
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hardcore'
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  
  // Wheel states
  const [category, setCategory] = useState(null);
  const [artist, setArtist] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [recentArtists, setRecentArtists] = useState([]);
  
  // Spinning states
  const [spinningCategory, setSpinningCategory] = useState(false);
  const [spinningArtist, setSpinningArtist] = useState(false);
  const [spinningChallenge, setSpinningChallenge] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  
  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(10);
  
  // Jokers
  const [jokers, setJokers] = useState([]);
  
  // Current round result
  const [currentResult, setCurrentResult] = useState(null);
  const [isDangerRound, setIsDangerRound] = useState(false);

  /**
   * Initialize jokers at game start
   */
  useEffect(() => {
    if (gameStarted && jokers.length === 0) {
      const jokerTypes = ['respin-artist', 'change-category', 'skip-challenge'];
      const selectedJokers = getRandomItems(jokerTypes, 2).map(type => ({
        type,
        used: false
      }));
      setJokers(selectedJokers);
    }
  }, [gameStarted, jokers.length]);

  /**
   * Check if current round is a danger round (every 4th round)
   */
  useEffect(() => {
    setIsDangerRound(round % 4 === 0);
  }, [round]);

  /**
   * Get available challenges based on round type
   */
  const getAvailableChallenges = () => {
    if (isDangerRound) {
      return challengesData.danger;
    }
    return challengesData.normal;
  };

  /**
   * Get artists for current category and difficulty
   */
  const getArtistsForCategory = (cat) => {
    if (!cat || !artistsData[cat]) return [];
    
    const allArtists = artistsData[cat];
    
    // Filter by difficulty (simplified - in real app, artists would be tagged)
    if (difficulty === 'easy') {
      // Return first 6-8 artists (assuming they're more popular)
      return allArtists.slice(0, Math.min(8, allArtists.length));
    } else if (difficulty === 'hardcore') {
      // Return all artists including less popular ones
      return allArtists;
    }
    // Medium: return all
    return allArtists;
  };

  /**
   * Start spinning sequence
   */
  const startSpin = () => {
    setCurrentResult(null);
    setTimerActive(false);
    
    // Reset wheel states
    setCategory(null);
    setArtist(null);
    setChallenge(null);
    
    // Increment spin key to reset wheel animations
    setSpinKey(prev => prev + 1);
    
    // Start category spin
    setSpinningCategory(true);
  };

  /**
   * Handle category spin complete
   */
  const handleCategoryComplete = (selectedCategory) => {
    setCategory(selectedCategory);
    setSpinningCategory(false);
    
    // Start artist spin after short delay
    setTimeout(() => {
      setSpinningArtist(true);
    }, 500);
  };

  /**
   * Handle artist spin complete
   */
  const handleArtistComplete = (selectedArtist) => {
    setArtist(selectedArtist);
    setSpinningArtist(false);
    
    // Update recent artists
    setRecentArtists(prev => updateRecentArtists(prev, selectedArtist));
    
    // Start challenge spin after short delay
    setTimeout(() => {
      setSpinningChallenge(true);
    }, 500);
  };

  /**
   * Handle challenge spin complete
   */
  const handleChallengeComplete = (selectedChallenge) => {
    setChallenge(selectedChallenge);
    setSpinningChallenge(false);
    
    // Determine timer duration based on challenge type
    const isQuickChallenge = selectedChallenge.includes('song') || 
                             selectedChallenge.includes('year');
    setTimerDuration(isQuickChallenge ? 5 : 10);
    
    // Start timer after short delay
    setTimeout(() => {
      setTimerActive(true);
    }, 500);
    
    // Set current result
    setCurrentResult({
      category,
      artist,
      challenge: selectedChallenge
    });
  };

  /**
   * Handle timer completion (auto-fail)
   */
  const handleTimerComplete = () => {
    setTimerActive(false);
    // Auto-fail - user can still mark it manually
  };

  /**
   * Handle joker use
   */
  const handleUseJoker = (jokerType) => {
    const updatedJokers = jokers.map(j => 
      j.type === jokerType ? { ...j, used: true } : j
    );
    setJokers(updatedJokers);

    if (jokerType === 'respin-artist') {
      // Reset artist and re-spin
      setArtist(null);
      setSpinningArtist(false);
      setSpinKey(prev => prev + 1);
      setTimeout(() => {
        setSpinningArtist(true);
      }, 100);
    } else if (jokerType === 'change-category') {
      // Reset category and artist, re-spin category
      setCategory(null);
      setArtist(null);
      setChallenge(null);
      setSpinningCategory(false);
      setSpinningArtist(false);
      setSpinKey(prev => prev + 1);
      setTimeout(() => {
        setSpinningCategory(true);
      }, 100);
    } else if (jokerType === 'skip-challenge') {
      // Skip to next round
      setTimerActive(false);
      nextRound();
    }
  };

  /**
   * Handle pass/fail result
   */
  const handleResult = (passed, answerType = 'popular') => {
    setTimerActive(false);
    
    if (passed) {
      const roundScore = calculateRoundScore({
        answerType,
        difficulty
      });
      setScore(prev => prev + roundScore);
    }
    
    // Move to next round after delay
    setTimeout(() => {
      nextRound();
    }, 1500);
  };

  /**
   * Move to next round
   */
  const nextRound = () => {
    setRound(prev => prev + 1);
    setCurrentResult(null);
    setCategory(null);
    setArtist(null);
    setChallenge(null);
    setTimerActive(false);
  };

  /**
   * Start new game
   */
  const startGame = () => {
    setGameStarted(true);
    setRound(1);
    setScore(0);
    setRecentArtists([]);
    setJokers([]);
    setCurrentResult(null);
  };

  /**
   * Reset game
   */
  const resetGame = () => {
    setGameStarted(false);
    setGameMode(null);
    setDifficulty(null);
    setRound(1);
    setScore(0);
    setRecentArtists([]);
    setJokers([]);
    setCurrentResult(null);
    setCategory(null);
    setArtist(null);
    setChallenge(null);
    setTimerActive(false);
  };

  // Home screen - Mode and difficulty selection
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl"
        >
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            Spin The Artist
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Test your music knowledge & taste
          </p>

          {/* Game Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['solo', 'party'].map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setGameMode(mode)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    gameMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hardcore'].map((diff) => (
                <motion.button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    difficulty === diff
                      ? diff === 'hardcore'
                        ? 'bg-red-600 text-white'
                        : diff === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            onClick={startGame}
            disabled={!gameMode || !difficulty}
            whileHover={{ scale: gameMode && difficulty ? 1.05 : 1 }}
            whileTap={{ scale: gameMode && difficulty ? 0.95 : 1 }}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              gameMode && difficulty
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            START GAME
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Score and Controls */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Home
            </motion.button>
            <div className="text-sm text-gray-400">
              {gameMode?.toUpperCase()} • {difficulty?.toUpperCase()}
            </div>
          </div>
          <ScoreBoard score={score} round={round} difficulty={difficulty} />
        </div>

        {/* Danger Round Banner */}
        <AnimatePresence>
          {isDangerRound && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-900/30 border-2 border-red-600 rounded-lg p-4 text-center"
            >
              <h2 className="text-2xl font-bold text-red-400">
                ⚠️ DANGER ROUND ⚠️
              </h2>
              <p className="text-red-300 mt-1">
                Prepare for controversial challenges!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wheels Display */}
        {!currentResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <CategoryWheel
              categories={categoriesData}
              onSpinComplete={handleCategoryComplete}
              isSpinning={spinningCategory}
              spinKey={spinKey}
            />
            <ArtistWheel
              artists={getArtistsForCategory(category)}
              recentArtists={recentArtists}
              onSpinComplete={handleArtistComplete}
              isSpinning={spinningArtist}
              category={category}
              spinKey={spinKey}
            />
            <ChallengeWheel
              challenges={getAvailableChallenges()}
              onSpinComplete={handleChallengeComplete}
              isSpinning={spinningChallenge}
              isDangerRound={isDangerRound}
              spinKey={spinKey}
            />
          </div>
        ) : (
          // Result Display
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-6"
          >
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-2">Category</div>
              <div className="text-2xl font-bold text-blue-400 mb-4">
                {currentResult.category}
              </div>
              
              <div className="text-sm text-gray-400 mb-2">Artist</div>
              <div className="text-3xl font-bold text-cyan-400 mb-4">
                {currentResult.artist}
              </div>
              
              <div className="text-sm text-gray-400 mb-2">Challenge</div>
              <div className={`text-2xl font-bold mb-6 ${
                isDangerRound ? 'text-red-400' : 'text-pink-400'
              }`}>
                {currentResult.challenge}
              </div>

              {/* Timer */}
              <div className="flex justify-center mb-6">
                <Timer
                  duration={timerDuration}
                  onComplete={handleTimerComplete}
                  isActive={timerActive}
                />
              </div>

              {/* Pass/Fail Buttons */}
              <div className="flex gap-4 justify-center mb-4">
                <motion.button
                  onClick={() => handleResult(true, 'popular')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors"
                >
                  ✓ PASS
                </motion.button>
                <motion.button
                  onClick={() => handleResult(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500 transition-colors"
                >
                  ✗ FAIL
                </motion.button>
              </div>

              {/* Bonus Options */}
              {timerActive && (
                <div className="flex gap-2 justify-center flex-wrap">
                  <motion.button
                    onClick={() => {
                      handleResult(true, 'underrated');
                      setTimerActive(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-500"
                  >
                    +3 Deep Cut
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      handleResult(true, 'explanation');
                      setTimerActive(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-500"
                  >
                    +1 Explained
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Spin Button */}
        {!spinningCategory && !spinningArtist && !spinningChallenge && !currentResult && (
          <div className="flex justify-center mb-6">
            <motion.button
              onClick={startSpin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
            >
              SPIN WHEELS
            </motion.button>
          </div>
        )}

        {/* Joker Panel */}
        <JokerPanel
          jokers={jokers}
          onUseJoker={handleUseJoker}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
}

export default App;
