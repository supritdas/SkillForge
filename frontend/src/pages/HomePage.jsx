// pages/HomePage.jsx — Landing page

import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay }) => (
  <div
    className="card hover:border-forge-500/30 transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-10 h-10 bg-forge-gradient rounded-xl flex items-center justify-center text-xl mb-4 shadow-lg shadow-forge-500/20">
      {icon}
    </div>
    <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
    <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

// ─── Tech Stack Badge ─────────────────────────────────────────────────────────
const TechBadge = ({ name }) => (
  <span className="px-3 py-1 bg-dark-800 border border-dark-700 text-dark-300 text-xs font-mono rounded-full">
    {name}
  </span>
);

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const user = useRecoilValue(userAtom);

  const features = [
    {
      icon: "🎮",
      title: "Gamified Learning",
      desc: "Earn XP and badges as you complete modules. Compete on the global leaderboard.",
    },
    {
      icon: "🤖",
      title: "AI Peer Matching",
      desc: "Our algorithm pairs you with a complementary study partner based on your skill profile.",
    },
    {
      icon: "💬",
      title: "Live Collaboration",
      desc: "Get a private Stream Chat room with your matched peer for real-time study sessions.",
    },
    {
      icon: "📈",
      title: "Skill Tracking",
      desc: "See exactly which skills you're building as you progress through each module.",
    },
  ];

  const techStack = [
    "Node.js", "Express", "MongoDB", "React", "Recoil",
    "React Router", "JWT", "Stream Chat", "TailwindCSS", "Vite",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="py-24 text-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-forge-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 badge-orange mb-6 py-1.5 px-4 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forge-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forge-500" />
            </span>
            Now with AI Peer Matching
          </div>

          <h1 className="text-5xl sm:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Learn. Build.
            <br />
            <span className="gradient-text">Connect.</span>
          </h1>

          <p className="text-dark-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillForge is a gamified course platform where your learning progress
            unlocks the perfect study partner. Level up your skills, earn badges,
            and build with others.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Start for free →
                </Link>
                <Link to="/courses" className="btn-secondary text-lg px-8 py-4">
                  Browse courses
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────── */}
      <section className="py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Why SkillForge</p>
          <h2 className="text-3xl font-display font-bold text-white">
            Built different
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* ── How peer matching works ────────────────────────── */}
      <section className="py-16 border-t border-dark-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-3">How it works</p>
          <h2 className="text-3xl font-display font-bold text-white mb-12">
            Your learning fuels the match
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Complete Modules", desc: "Each module you finish updates your skill score." },
              { step: "02", title: "Build Your Profile", desc: "Your strengths and gaps are tracked automatically." },
              { step: "03", title: "Get Matched", desc: "We pair you with someone whose skills complement yours." },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="font-mono text-5xl font-bold text-dark-800 mb-3">{s.step}</div>
                <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-dark-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────── */}
      <section className="py-16 border-t border-dark-800">
        <p className="text-center section-label mb-6">Built with</p>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      {!user && (
        <section className="py-16 border-t border-dark-800 text-center">
          <div className="bg-card-gradient border border-dark-700 rounded-3xl p-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Ready to forge your skills?
            </h2>
            <p className="text-dark-300 mb-8 text-lg">
              Join thousands of developers levelling up every day.
            </p>
            <Link to="/register" className="btn-primary text-lg px-10 py-4">
              Create free account →
            </Link>
          </div>
        </section>
      )}

      <footer className="py-8 border-t border-dark-800 text-center text-dark-500 text-sm font-mono">
        SkillForge © {new Date().getFullYear()} — Built with React, Express & ❤️
      </footer>
    </div>
  );
};

export default HomePage;
