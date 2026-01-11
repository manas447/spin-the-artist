import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRandomItem } from '../utils/randomizer';

/**
 * ChallengeWheel component - Third wheel that spins to select a challenge
 * @param {Array} challenges - Array of challenge strings
 * @param {Function} onSpinComplete - Callback when spin completes with selected challenge
 * @param {boolean} isSpinning - Whether wheel is currently spinning
 * @param {boolean} isDangerRound - Whether this is a danger round
 */
export default function ChallengeWheel({ 
  challenges = [], 
  onSpinComplete, 
  isSpinning = false,
  isDangerRound = false,
  spinKey = 0
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isSpinning && challenges.length > 0) {
      // Random spin: 3-5 full rotations + random offset
      const spins = 3 + Math.random() * 2;
      const randomChallenge = getRandomItem(challenges);
      const randomIndex = challenges.indexOf(randomChallenge);
      const segmentAngle = 360 / challenges.length;
      const targetRotation = spins * 360 + (360 - randomIndex * segmentAngle);
      
      setRotation(targetRotation);
      setSelectedIndex(randomIndex);
      
      // Trigger callback after animation
      const timer = setTimeout(() => {
        onSpinComplete?.(randomChallenge);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!isSpinning) {
      // Reset when not spinning
      setSelectedIndex(0);
    }
  }, [isSpinning, challenges, onSpinComplete, spinKey]);

  if (challenges.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-gray-300 uppercase tracking-wide">
          Challenge
        </h2>
        <div className="text-gray-500">No challenges available</div>
      </div>
    );
  }

  const segmentAngle = 360 / challenges.length;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-300 uppercase tracking-wide">
          Challenge
        </h2>
        {isDangerRound && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded"
          >
            DANGER
          </motion.span>
        )}
      </div>
      
      <div className="relative w-64 h-64">
        {/* Wheel Container */}
        <motion.div
          key={spinKey}
          className={`relative w-full h-full rounded-full border-4 overflow-hidden ${
            isDangerRound ? 'border-red-600' : 'border-gray-700'
          }`}
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        >
          {/* Segments */}
          {challenges.map((challenge, index) => {
            const angle = (index * segmentAngle) * (Math.PI / 180);
            const colors = isDangerRound
              ? ['bg-red-700', 'bg-orange-700', 'bg-amber-700', 'bg-yellow-700', 'bg-red-800']
              : ['bg-violet-600', 'bg-fuchsia-600', 'bg-rose-600', 'bg-pink-600', 'bg-purple-600'];
            
            return (
              <div
                key={challenge}
                className={`absolute ${colors[index % colors.length]} text-white font-bold`}
                style={{
                  width: '100%',
                  height: '100%',
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(angle)}% ${50 - 50 * Math.sin(angle)}%, ${50 + 50 * Math.cos(angle + segmentAngle * Math.PI / 180)}% ${50 - 50 * Math.sin(angle + segmentAngle * Math.PI / 180)}%)`,
                  transformOrigin: 'center',
                }}
              >
                <div
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${index * segmentAngle + segmentAngle / 2}deg)`,
                    transformOrigin: 'center',
                    width: '75%',
                    textAlign: 'center',
                  }}
                >
                  <span className="text-xs">{challenge}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
          <div className={`w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent ${
            isDangerRound ? 'border-t-red-500' : 'border-t-yellow-400'
          }`}></div>
        </div>
      </div>

      {/* Selected Challenge Display */}
      {!isSpinning && selectedIndex !== null && challenges[selectedIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-bold mt-2 text-center px-4 max-w-xs ${
            isDangerRound ? 'text-red-400' : 'text-pink-400'
          }`}
        >
          {challenges[selectedIndex]}
        </motion.div>
      )}
    </div>
  );
}
