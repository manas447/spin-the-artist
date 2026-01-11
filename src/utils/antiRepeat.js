/**
 * Anti-repeat logic to prevent same artists from appearing in last 3 rounds
 */

/**
 * Filter out recently played artists
 * @param {Array} allArtists - All available artists
 * @param {Array} recentArtists - Last 3 played artists
 * @returns {Array} Filtered artists
 */
export function filterRecentArtists(allArtists, recentArtists) {
  if (!recentArtists || recentArtists.length === 0) {
    return allArtists;
  }
  
  // Filter out artists that appeared in last 3 rounds
  const recentSet = new Set(recentArtists);
  const filtered = allArtists.filter(artist => !recentSet.has(artist));
  
  // If all artists were filtered out, return all (edge case)
  return filtered.length > 0 ? filtered : allArtists;
}

/**
 * Update recent artists list (keep only last 3)
 * @param {Array} recentArtists - Current recent artists
 * @param {string} newArtist - Newly played artist
 * @returns {Array} Updated recent artists
 */
export function updateRecentArtists(recentArtists, newArtist) {
  const updated = [...(recentArtists || [])];
  updated.push(newArtist);
  
  // Keep only last 3
  if (updated.length > 3) {
    updated.shift();
  }
  
  return updated;
}
