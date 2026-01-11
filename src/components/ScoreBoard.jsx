import { motion } from 'framer-motion';

/**
 * ScoreBoard component to display current score and round number
 * @param {number} score - Current total score
 * @param {number} round - Current round number
 * @param {string} difficulty - Current difficulty mode
 */
export default function ScoreBoard({ score = 0, round = 1, difficulty = 'medium' }) {
  return (
    <div className="flex items-center justify-center gap-6 mb-4">
      {/* Score Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-lg px-6 py-3 border border-gray-700"
      >
        <div className="text-xs text-gray-400 uppercase tracking-wide">Score</div>
        <motion.div
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-blue-400"
        >
          {score}
        </motion.div>
      </motion.div>

      {/* Round Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-lg px-6 py-3 border border-gray-700"
      >
        <div className="text-xs text-gray-400 uppercase tracking-wide">Round</div>
        <div className="text-3xl font-bold text-purple-400">{round}</div>
      </motion.div>

      {/* Difficulty Badge */}
      <div className="bg-gray-900 rounded-lg px-4 py-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase tracking-wide">Mode</div>
        <div className="text-lg font-semibold capitalize text-yellow-400">
          {difficulty}
        </div>
      </div>
    </div>
  );
}
