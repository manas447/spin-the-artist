import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Timer component with countdown display
 * @param {number} duration - Timer duration in seconds
 * @param {Function} onComplete - Callback when timer reaches zero
 * @param {boolean} isActive - Whether timer is currently running
 */
export default function Timer({ duration = 10, onComplete, isActive = false }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, duration, onComplete]);

  // Reset when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const percentage = (timeLeft / duration) * 100;
  const isLowTime = timeLeft <= 3;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        {/* Circular progress */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-800"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={isLowTime ? 'text-red-500' : 'text-blue-500'}
            initial={{ pathLength: 1 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </svg>
        
        {/* Time text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${isLowTime ? 'text-red-500' : 'text-white'}`}
          >
            {timeLeft}
          </motion.span>
        </div>
      </div>
      
      {isActive && (
        <p className="text-sm text-gray-400">
          {isLowTime ? 'Hurry up!' : 'Time remaining'}
        </p>
      )}
    </div>
  );
}
