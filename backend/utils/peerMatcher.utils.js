// utils/peerMatcher.utils.js — AI-style skill clustering for peer matching
//
// How it works:
// 1. Get all students who are enrolled in a course
// 2. Look at each student's skillMetrics array
// 3. Find pairs whose strengths COMPLEMENT each other
//    (e.g., strong React student + strong Node.js student)
// 4. Return the best match pair

/**
 * Calculate a "complementary score" between two students.
 * High score = they cover each other's weak spots well.
 *
 * @param {object} studentA - User document with skillMetrics
 * @param {object} studentB - User document with skillMetrics
 * @returns {number} Complementary score (higher is better)
 */
const getComplementaryScore = (studentA, studentB) => {
  let score = 0;

  studentA.skillMetrics.forEach((metricA) => {
    const metricB = studentB.skillMetrics.find((m) => m.skill === metricA.skill);

    if (metricB) {
      // If A is strong where B is weak, that's complementary
      const diff = Math.abs(metricA.score - metricB.score);
      score += diff; // Bigger difference = more complementary
    }
  });

  return score;
};

/**
 * Find the best peer match for a given student from a pool of candidates.
 *
 * @param {object} targetStudent - The student we want to find a match for
 * @param {Array} candidates - Array of other student User documents
 * @returns {{ match: object, reason: string, skills: string[] } | null}
 */
const findBestMatch = (targetStudent, candidates) => {
  if (!candidates || candidates.length === 0) return null;

  let bestMatch = null;
  let bestScore = -1;
  let complementarySkills = [];

  candidates.forEach((candidate) => {
    // Don't match a student with themselves
    if (candidate._id.toString() === targetStudent._id.toString()) return;

    const score = getComplementaryScore(targetStudent, candidate);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;

      // Find which specific skills make them complementary
      complementarySkills = targetStudent.skillMetrics
        .filter((metricA) => {
          const metricB = candidate.skillMetrics.find((m) => m.skill === metricA.skill);
          return metricB && Math.abs(metricA.score - metricB.score) > 20;
        })
        .map((m) => m.skill);
    }
  });

  if (!bestMatch) return null;

  // Build a human-readable reason for the match
  const reason =
    complementarySkills.length > 0
      ? `Matched based on complementary skills in: ${complementarySkills.join(", ")}`
      : "Matched based on overall learning compatibility";

  return { match: bestMatch, reason, skills: complementarySkills };
};

module.exports = { findBestMatch, getComplementaryScore };
