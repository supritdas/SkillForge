// pages/PeerMatchPage.jsx — AI-powered peer matching (multiple peers allowed)

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import api from "../utils/api";
import PeerMatchCard from "../components/peer/PeerMatchCard";
import SkillRadar from "../components/dashboard/SkillRadar";
import Spinner from "../components/ui/Spinner";
import useToast from "../hooks/useToast";

const MatchingAnimation = () => {
  const steps = [
    "Analyzing your skill profile...",
    "Scanning enrolled students...",
    "Computing complementary scores...",
    "Found your perfect match! 🎉",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= steps.length - 1) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative">
        <div className="w-20 h-20 bg-forge-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-forge-500/30 animate-float">
          <span className="text-4xl">🤖</span>
        </div>
        <div className="absolute -inset-2 bg-forge-500/20 rounded-2xl blur-xl animate-pulse" />
      </div>
      <div className="space-y-2 text-center">
        {steps.map((s, i) => (
          <p
            key={s}
            className={`font-mono text-sm transition-all duration-500 ${
              i <= step ? "text-white opacity-100" : "text-dark-600 opacity-0"
            } ${i === step ? "text-forge-400" : ""}`}
          >
            {i < step ? "✓ " : i === step ? "→ " : "  "}
            {s}
          </p>
        ))}
      </div>
    </div>
  );
};

const PeerMatchPage = () => {
  const user = useRecoilValue(userAtom);
  const { showToast } = useToast();

  const [matches, setMatches] = useState([]);
  const [finding, setFinding] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState(null);

  const loadMatches = async () => {
    const { data } = await api.get("/peers/my-matches");
    setMatches(data.matches || []);
    return data.matches;
  };

  useEffect(() => {
    const checkExisting = async () => {
      try {
        await loadMatches();
      } catch {
        setMatches([]);
      } finally {
        setLoadingExisting(false);
      }
    };
    checkExisting();
  }, []);

  const handleFindMatch = async () => {
    setFinding(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 3200));

    try {
      const { data } = await api.post("/peers/match");
      await loadMatches();
      showToast(data.message || "Peer match found! 🎉", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Matching failed. Try again.";
      setError(msg);
      showToast(msg, "error");
      try {
        await loadMatches();
      } catch {
        /* keep current list */
      }
    } finally {
      setFinding(false);
    }
  };

  if (loadingExisting) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasMatches = matches.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="section-label mb-3">Hackathon-Style</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          AI Peer Matching
        </h1>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          Match with multiple study partners — each pair gets a private chat room.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <p className="section-label mb-4">Your Skill Profile</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-forge-gradient rounded-xl flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-display font-semibold text-white">{user?.name}</p>
                <div className="badge-orange text-xs">⚡ {user?.xp} XP</div>
              </div>
            </div>
            <SkillRadar skillMetrics={user?.skillMetrics || []} />
          </div>

          <div className="card">
            <p className="section-label mb-4">How Matching Works</p>
            <div className="space-y-3">
              {[
                { icon: "📊", text: "Pairs you with students in your courses" },
                { icon: "🔄", text: "Find multiple peers — one private chat per match" },
                { icon: "🧮", text: "Complementary skills scoring for each new match" },
                { icon: "💬", text: "Each match gets its own Stream Chat channel" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-dark-300 text-xs font-mono leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {finding && <MatchingAnimation />}

          {!finding && hasMatches && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-emerald-400 text-sm font-mono font-medium">
                    {matches.length} active {matches.length === 1 ? "match" : "matches"}
                  </p>
                </div>
                <button
                  onClick={handleFindMatch}
                  disabled={finding}
                  className="btn-secondary text-sm py-2"
                >
                  + Find Another Peer
                </button>
              </div>

              <div className="space-y-4">
                {matches.map((m) => (
                  <PeerMatchCard
                    key={m._id}
                    match={m}
                    currentUserId={user?._id ?? user?.id}
                  />
                ))}
              </div>
            </div>
          )}

          {!finding && !hasMatches && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-dark-800 border border-dark-700 rounded-3xl flex items-center justify-center text-5xl">
                  🤝
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-white mb-3">
                Ready to find your first peer?
              </h2>
              <p className="text-dark-400 text-sm max-w-xs mb-8 font-mono">
                You can match with many students over time — each gets a separate chat.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl max-w-sm">
                  <p className="text-red-400 text-sm font-mono">{error}</p>
                </div>
              )}

              <button
                onClick={handleFindMatch}
                disabled={finding}
                className="btn-primary text-lg px-10 py-4 animate-pulse2"
              >
                Find My Match →
              </button>
            </div>
          )}

          {!finding && hasMatches && error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerMatchPage;
