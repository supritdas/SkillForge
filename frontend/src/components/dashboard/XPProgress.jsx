// components/dashboard/XPProgress.jsx — Shows user XP and next level progress

const LEVELS = [
  { name: "Spark", min: 0, max: 299 },
  { name: "Rising Star", min: 300, max: 699 },
  { name: "Knowledge Seeker", min: 700, max: 1499 },
  { name: "Forge Master", min: 1500, max: 2999 },
  { name: "Legend", min: 3000, max: Infinity },
];

const XPProgress = ({ xp }) => {
  // Find the current level
  const currentLevel = LEVELS.find((lvl) => xp >= lvl.min && xp <= lvl.max) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];

  // Calculate progress percentage within this level
  const progress = nextLevel
    ? ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="font-display font-semibold text-forge-400">{currentLevel.name}</span>
          {nextLevel && (
            <span className="text-dark-400 text-xs ml-2">→ {nextLevel.name}</span>
          )}
        </div>
        <span className="font-mono font-bold text-white">{xp} XP</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-forge-gradient rounded-full transition-all duration-700"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {nextLevel && (
        <p className="text-dark-500 text-xs font-mono">
          {nextLevel.min - xp} XP to {nextLevel.name}
        </p>
      )}
    </div>
  );
};

export default XPProgress;
