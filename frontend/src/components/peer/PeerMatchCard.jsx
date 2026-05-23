// components/peer/PeerMatchCard.jsx — Displays a matched peer's info

import { Link } from "react-router-dom";
import { getPeerFromMatch } from "../../utils/peer";

const PeerMatchCard = ({ match, currentUserId }) => {
  const peer = getPeerFromMatch(match, currentUserId);

  if (!peer?.name) {
    return (
      <div className="card border-amber-500/30 bg-amber-500/5">
        <p className="text-amber-400 text-sm font-mono text-center">
          Match found — loading partner details… Refresh the page if this persists.
        </p>
      </div>
    );
  }

  return (
    <div className="card border-forge-500/30 bg-forge-500/5">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-forge-gradient rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-forge-500/20 animate-float">
          {peer.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-display font-semibold text-white text-lg">{peer.name}</h3>
          <div className="flex items-center gap-2">
            <span className="badge-orange">⚡ {peer.xp ?? 0} XP</span>
            <span className="text-xs text-dark-400 font-mono">Study Partner</span>
          </div>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse2" />
        </div>
      </div>

      {match.matchReason && (
        <div className="bg-dark-800 rounded-xl p-3 mb-4">
          <p className="text-xs font-mono text-dark-300">
            <span className="text-forge-400">✦ Match reason:</span> {match.matchReason}
          </p>
        </div>
      )}

      {match.complementarySkills?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-dark-400 font-mono mb-2">Complementary skills:</p>
          <div className="flex flex-wrap gap-2">
            {match.complementarySkills.map((skill) => (
              <span key={skill} className="badge-orange">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {peer.skillMetrics?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-dark-400 font-mono mb-2">Their skills:</p>
          <div className="space-y-2">
            {peer.skillMetrics.slice(0, 4).map(({ skill, score }) => (
              <div key={skill}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono text-dark-300">{skill}</span>
                  <span className="font-mono text-forge-400">{score}%</span>
                </div>
                <div className="h-1 bg-dark-700 rounded-full">
                  <div
                    className="h-full bg-forge-gradient rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-dark-700">
        {match.streamChannelId ? (
          <Link
            to={`/chat/${match._id}`}
            className="btn-primary text-sm py-2 block text-center"
          >
            Chat with {peer.name.split(" ")[0]} →
          </Link>
        ) : (
          <p className="text-amber-400 text-xs font-mono text-center">
            Chat room is being set up. Refresh this page in a moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default PeerMatchCard;
