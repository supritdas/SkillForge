// components/layout/Navbar.jsx — Top navigation bar

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/atoms";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const user = useRecoilValue(userAtom);
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  const navLinks = [
    { to: "/courses", label: "Courses" },
    { to: "/leaderboard", label: "Leaderboard" },
    ...(user && isInstructor
      ? [{ to: "/instructor", label: "My Courses" }]
      : []),
    ...(user && !isInstructor
      ? [
          { to: "/peer-match", label: "Peer Match" },
          { to: "/chat", label: "Peer Chat" },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-800 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forge-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">SF</span>
            </div>
            <span className="font-display font-semibold text-lg text-white">
              Skill<span className="gradient-text">Forge</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `btn-ghost text-sm ${isActive ? "text-forge-400" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* XP badge */}
                <div className="badge-orange">
                  <span>⚡</span>
                  <span>{user.xp} XP</span>
                </div>

                <Link
                  to={isInstructor ? "/instructor" : "/dashboard"}
                  className="flex items-center gap-2 btn-ghost text-sm"
                >
                  <div className="w-7 h-7 bg-forge-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {user.name.split(" ")[0]}
                </Link>

                <button onClick={logout} className="btn-secondary text-sm py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-dark-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg"
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 text-center">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
