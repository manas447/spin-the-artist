import { motion } from 'framer-motion';

/**
 * JokerPanel component - Displays available jokers/power cards
 * @param {Array} jokers - Array of joker objects with { type, used }
 * @param {Function} onUseJoker - Callback when joker is used
 * @param {string} difficulty - Current difficulty mode
 */
export default function JokerPanel({ jokers = [], onUseJoker, difficulty = 'medium' }) {
  const jokerTypes = {
    'respin-artist': {
      label: 'Re-spin Artist',
      icon: '🔄',
      disabled: difficulty === 'hardcore'
    },
    'change-category': {
      label: 'Change Category',
      icon: '🎯',
      disabled: difficulty === 'hardcore'
    },
    'skip-challenge': {
      label: 'Skip Challenge',
      icon: '⏭️',
      disabled: false
    }
  };

  if (jokers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        Power Cards
      </h3>
      <div className="flex gap-3 flex-wrap justify-center">
        {jokers.map((joker, index) => {
          const jokerInfo = jokerTypes[joker.type] || { label: joker.type, icon: '🎴', disabled: false };
          const isDisabled = joker.used || jokerInfo.disabled;

          return (
            <motion.button
              key={index}
              onClick={() => !isDisabled && onUseJoker?.(joker.type)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm
                transition-all duration-200
                ${isDisabled
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                }
              `}
            >
              <span className="mr-2">{jokerInfo.icon}</span>
              {jokerInfo.label}
              {joker.used && <span className="ml-2 text-xs">(Used)</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
