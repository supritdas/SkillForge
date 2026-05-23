// pages/DashboardPage.jsx — Logged-in user's personal learning hub

import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom, streamTokenAtom } from "../store/atoms";
import api from "../utils/api";
import XPProgress from "../components/dashboard/XPProgress";
import SkillRadar from "../components/dashboard/SkillRadar";
import BadgeShelf from "../components/dashboard/BadgeShelf";
import Spinner from "../components/ui/Spinner";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon }) => (
  <div className="card text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-display font-bold text-white">{value}</div>
    <div className="text-dark-400 text-xs font-mono mt-1">{label}</div>
  </div>
);

// ─── Enrolled Course Row ──────────────────────────────────────────────────────
const EnrolledCourseRow = ({ enrollment }) => {
  const course = enrollment.course;
  if (!course) return null;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="flex items-center gap-4 p-3 bg-dark-900 rounded-xl hover:bg-dark-800 border border-dark-700 hover:border-forge-500/30 transition-all duration-200"
    >
      {/* Thumbnail or placeholder */}
      <div className="w-12 h-12 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-forge-gradient opacity-30" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display font-medium text-white text-sm truncate">{course.title}</p>
        <p className="text-dark-400 text-xs font-mono mt-0.5">{course.category} · {course.level}</p>
      </div>

      {/* Progress */}
      <div className="text-right flex-shrink-0">
        <p className="font-mono font-bold text-forge-400 text-sm">{enrollment.progress || 0}%</p>
        <div className="w-16 h-1 bg-dark-700 rounded-full mt-1">
          <div
            className="h-full bg-forge-gradient rounded-full"
            style={{ width: `${enrollment.progress || 0}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

// ─── DashboardPage ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const setStreamToken = useSetRecoilState(streamTokenAtom);
  const [loading, setLoading] = useState(true);

  // Re-fetch user on mount to get latest XP, skills, courses
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        if (data.streamToken) {
          setStreamToken(data.streamToken);
          localStorage.setItem("skillforge_stream_token", data.streamToken);
        }
      } catch (err) {
        console.error("Failed to refresh user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, setStreamToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user?.role === "instructor" || user?.role === "admin") {
    return <Navigate to="/instructor" replace />;
  }

  const enrolledCourses = user?.enrolledCourses || [];
  const completedModulesTotal = enrolledCourses.reduce(
    (sum, e) => sum + (e.completedModules?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Welcome Header ─────────────────────────────────── */}
      <div className="mb-10">
        <p className="section-label mb-2">Dashboard</p>
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-dark-400 mt-1">Keep building — every module counts.</p>
      </div>

      {/* ── XP Progress ────────────────────────────────────── */}
      <div className="card mb-6">
        <p className="section-label mb-3">XP Progress</p>
        <XPProgress xp={user?.xp || 0} />
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total XP" value={user?.xp || 0} icon="⚡" />
        <StatCard label="Courses Enrolled" value={enrolledCourses.length} icon="📚" />
        <StatCard label="Modules Done" value={completedModulesTotal} icon="✅" />
        <StatCard label="Badges Earned" value={user?.badges?.length || 0} icon="🏅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── My Courses ─────────────────────────────────────── */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">My Courses</p>
            <Link to="/courses" className="text-xs text-forge-400 hover:underline font-mono">
              Browse more →
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-dark-400 text-sm font-mono mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <Link to="/courses" className="btn-primary text-sm py-2">
                Browse Courses →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map((enrollment) => (
                <EnrolledCourseRow
                  key={enrollment.course?._id || enrollment._id}
                  enrollment={enrollment}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column ───────────────────────────────────── */}
        <div className="space-y-6">

          {/* Skill Radar */}
          <div className="card">
            <p className="section-label mb-4">Skill Profile</p>
            <SkillRadar skillMetrics={user?.skillMetrics || []} />
          </div>

          {/* Badges */}
          <div className="card">
            <p className="section-label mb-4">Badges</p>
            <BadgeShelf badges={user?.badges || []} />
          </div>

          {/* Peer Match CTA */}
          <div className="card border-forge-500/30 bg-forge-500/5 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-display font-semibold text-white mb-2">
              Find a Study Buddy
            </h3>
            <p className="text-dark-400 text-sm mb-4">
              Get matched with a peer who complements your skill set.
            </p>
            <Link to="/peer-match" className="btn-primary text-sm py-2 block">
              Find Peer Match →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
