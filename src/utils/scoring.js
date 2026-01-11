export function calculateRoundScore({
    isDeepCut = false,
    hasExplanation = false,
    difficulty = "easy",
  }) {
    let score = 0;
  
    // base score
    score += isDeepCut ? 3 : 1;
  
    // explanation bonus
    if (hasExplanation) {
      score += 1;
    }
  
    // hardcore multiplier
    if (difficulty === "hardcore") {
      score = Math.floor(score * 1.5);
    }
  
    return score;
  }
  