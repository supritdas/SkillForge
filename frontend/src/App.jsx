// src/App.jsx — Root component: sets up routes and global providers
//
// This file ONLY handles routing. All page content lives in /pages.

import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "./store/atoms";
import { AuthProvider } from "./context/AuthContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Toast from "./components/ui/Toast";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import DashboardPage from "./pages/DashboardPage";
import PeerMatchPage from "./pages/PeerMatchPage";
import ChatPage from "./pages/ChatPage";
import InstructorDashboardPage from "./pages/InstructorDashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";

// ─── Protected Route Wrapper ─────────────────────────────────────────────────
// Redirects to /login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const token = useRecoilValue(tokenAtom);
  return token ? children : <Navigate to="/login" replace />;
};

// ─── App ─────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <AuthProvider>
      {/* Global toast notification overlay */}
      <Toast />

      <div className="min-h-screen bg-dark-950">
        <Navbar />

        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Protected routes — require login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/peer-match"
              element={
                <ProtectedRoute>
                  <PeerMatchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:matchId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor"
              element={
                <ProtectedRoute>
                  <InstructorDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
