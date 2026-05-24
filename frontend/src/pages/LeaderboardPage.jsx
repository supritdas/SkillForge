// pages/LeaderboardPage.jsx — Global XP leaderboard

import { useState, useEffect } from "react";
import api from "../utils/api";
import Spinner from "../components/ui/Spinner";

const RANK_STYLES = [
  "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",   // 1st
  "text-slate-300 bg-slate-400/10 border-slate-400/30",      // 2nd
  "text-amber-600 bg-amber-700/10 border-amber-600/30",      // 3rd
];

const RANK_ICONS = ["🥇", "🥈", "🥉"];

const LeaderboardRow = ({ student, rank }) => {
  const isTop3 = rank <= 3;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
        ${isTop3
          ? `${RANK_STYLES[rank - 1]} bg-opacity-5`
          : "bg-dark-800 border-dark-700 hover:border-dark-600"
        }`}
    >
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {isTop3 ? (
          <span className="text-xl">{RANK_ICONS[rank - 1]}</span>
        ) : (
          <span className="font-mono font-bold text-dark-400 text-sm">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white flex-shrink-0
          ${isTop3 ? "bg-forge-gradient shadow-lg shadow-forge-500/20" : "bg-dark-700"}`}
      >
        {student.name.charAt(0).toUpperCase()}
      </div>

      {/* Name + badges */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-white truncate">{student.name}</p>
        {student.badges?.length > 0 && (
          <div className="flex gap-1 mt-1">
            {student.badges.slice(0, 3).map((badge) => (
              <span key={badge} className="text-xs">
                {badge === "Rising Star" ? "⭐" : badge === "Knowledge Seeker" ? "🎓" : "🔥"}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <p className="font-mono font-bold text-forge-400 text-base">{student.xp}</p>
        <p className="text-dark-500 text-xs font-mono">XP</p>
      </div>
    </div>
  );
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get(`${import.meta.env.VITE_API_URL}/api/users/leaderboard`);
        setLeaderboard(data.leaderboard);
      } catch (err) {
        setError("Could not load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="section-label mb-2">Global Rankings</p>
        <h1 className="text-4xl font-display font-bold text-white mb-3">Leaderboard</h1>
        <p className="text-dark-400 text-sm">
          Top learners ranked by XP earned. Complete modules to climb the board.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-400 font-mono">{error}</div>
      )}

      {!loading && leaderboard.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-dark-400 font-mono">No students ranked yet. Be the first!</p>
        </div>
      )}

      {!loading && leaderboard.length > 0 && (
        <div className="space-y-3">
          {leaderboard.map((student, index) => (
            <LeaderboardRow key={student._id} student={student} rank={index + 1} />
          ))}
        </div>
      )}

      <p className="text-center text-dark-600 text-xs font-mono mt-8">
        Updated in real-time · Top 10 students shown
      </p>
    </div>
  );
};

export default LeaderboardPage;
