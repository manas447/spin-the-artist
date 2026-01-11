import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRandomItem } from '../utils/randomizer';
import { filterRecentArtists } from '../utils/antiRepeat';

/**
 * ArtistWheel component - Second wheel that spins to select an artist from a category
 * @param {Array} artists - Array of artist strings for current category
 * @param {Array} recentArtists - Recently played artists (last 3)
 * @param {Function} onSpinComplete - Callback when spin completes with selected artist
 * @param {boolean} isSpinning - Whether wheel is currently spinning
 * @param {string} category - Current category name
 */
export default function ArtistWheel({ 
  artists = [], 
  recentArtists = [],
  onSpinComplete, 
  isSpinning = false,
  category = '',
  spinKey = 0
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [availableArtists, setAvailableArtists] = useState(artists);
  const [playedArtists, setPlayedArtists] = useState(new Set());

  // Filter out recent artists and update available list
  useEffect(() => {
    if (artists.length > 0) {
      const filtered = filterRecentArtists(artists, recentArtists);
      setAvailableArtists(filtered.length > 0 ? filtered : artists);
    }
  }, [artists, recentArtists]);

  // Mark artists as played
  useEffect(() => {
    if (recentArtists.length > 0) {
      setPlayedArtists(new Set(recentArtists));
    }
  }, [recentArtists]);

  useEffect(() => {
    if (isSpinning && availableArtists.length > 0) {
      // Random spin: 3-5 full rotations + random offset
      const spins = 3 + Math.random() * 2;
      const randomArtist = getRandomItem(availableArtists);
      const randomIndex = availableArtists.indexOf(randomArtist);
      const segmentAngle = 360 / availableArtists.length;
      const targetRotation = spins * 360 + (360 - randomIndex * segmentAngle);
      
      setRotation(targetRotation);
      setSelectedIndex(randomIndex);
      
      // Trigger callback after animation
      const timer = setTimeout(() => {
        onSpinComplete?.(randomArtist);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!isSpinning) {
      // Reset when not spinning
      setSelectedIndex(0);
    }
  }, [isSpinning, availableArtists, onSpinComplete, spinKey]);

  if (availableArtists.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-gray-300 uppercase tracking-wide">
          Artist
        </h2>
        <div className="text-gray-500">No artists available</div>
      </div>
    );
  }

  const segmentAngle = 360 / availableArtists.length;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-gray-300 uppercase tracking-wide">
        Artist
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
          {availableArtists.map((artist, index) => {
            const angle = (index * segmentAngle) * (Math.PI / 180);
            const isPlayed = playedArtists.has(artist);
            const colors = [
              'bg-indigo-600',
              'bg-cyan-600',
              'bg-teal-600',
              'bg-emerald-600',
              'bg-lime-600',
              'bg-amber-600',
            ];
            
            return (
              <div
                key={artist}
                className={`absolute ${isPlayed ? 'bg-gray-700 opacity-50' : colors[index % colors.length]} text-white font-bold`}
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
                  <span className="text-xs md:text-sm">{artist}</span>
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

      {/* Selected Artist Display */}
      {!isSpinning && selectedIndex !== null && availableArtists[selectedIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-cyan-400 mt-2 text-center px-4"
        >
          {availableArtists[selectedIndex]}
        </motion.div>
      )}
    </div>
  );
}
