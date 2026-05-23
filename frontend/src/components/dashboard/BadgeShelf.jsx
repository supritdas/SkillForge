// components/dashboard/BadgeShelf.jsx — Displays earned badges

const BADGE_META = {
  "Rising Star":     { emoji: "⭐", desc: "Earn 500 XP",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  "Knowledge Seeker":{ emoji: "🎓", desc: "Earn 1000 XP",  color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  "Forge Master":    { emoji: "🔥", desc: "Earn 1500 XP",  color: "text-forge-400 bg-forge-400/10 border-forge-400/20" },
  "Legend":          { emoji: "👑", desc: "Earn 3000 XP",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
};

const BadgeShelf = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8 text-dark-400 text-sm">
        <p>🏆 Complete courses to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => {
        const meta = BADGE_META[badge] || { emoji: "🏅", desc: badge, color: "text-dark-300 bg-dark-700/50 border-dark-600" };
        return (
          <div
            key={badge}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${meta.color}`}
          >
            <span className="text-xl">{meta.emoji}</span>
            <div>
              <p className="font-display font-semibold text-xs">{badge}</p>
              <p className="font-mono text-[10px] opacity-60">{meta.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeShelf;
