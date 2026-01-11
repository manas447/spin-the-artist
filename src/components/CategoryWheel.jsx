import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * CategoryWheel component - First wheel that spins to select a music category
 * @param {Array} categories - Array of category strings
 * @param {Function} onSpinComplete - Callback when spin completes with selected category
 * @param {boolean} isSpinning - Whether wheel is currently spinning
 */
export default function CategoryWheel({ categories = [], onSpinComplete, isSpinning = false, spinKey = 0 }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  // Calculate angle per segment
  const segmentAngle = 360 / categories.length;

  useEffect(() => {
    if (isSpinning) {
      // Random spin: 3-5 full rotations + random offset
      const spins = 3 + Math.random() * 2;
      const randomIndex = Math.floor(Math.random() * categories.length);
      const targetRotation = spins * 360 + (360 - randomIndex * segmentAngle);
      
      setRotation(targetRotation);
      setSelectedIndex(randomIndex);
      
      // Trigger callback after animation
      const timer = setTimeout(() => {
        onSpinComplete?.(categories[randomIndex]);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!isSpinning) {
      // Reset when not spinning
      setSelectedIndex(0);
    }
  }, [isSpinning, categories, segmentAngle, onSpinComplete, spinKey]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-gray-300 uppercase tracking-wide">
        Category
      </h2>
      
      <div className="relative w-64 h-64">
        {/* Wheel Container */}
        <motion.div
          key={spinKey}
          className="relative w-full h-full rounded-full border-4 border-gray-700 overflow-hidden"
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        >
          {/* Segments */}
          {categories.map((category, index) => {
            const angle = (index * segmentAngle) * (Math.PI / 180);
            const colors = [
              'bg-blue-600',
              'bg-purple-600',
              'bg-pink-600',
              'bg-green-600',
              'bg-yellow-600',
              'bg-red-600',
            ];
            
            return (
              <div
                key={category}
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
                    width: '80%',
                    textAlign: 'center',
                  }}
                >
                  <span className="text-sm md:text-base">{category}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400"></div>
        </div>
      </div>

      {/* Selected Category Display */}
      {!isSpinning && selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-yellow-400 mt-2"
        >
          {categories[selectedIndex]}
        </motion.div>
      )}
    </div>
  );
}
