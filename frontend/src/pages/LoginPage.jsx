// pages/LoginPage.jsx — Login page

import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[400px] bg-forge-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="card border-dark-700">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-forge-gradient rounded-xl flex items-center justify-center shadow-lg shadow-forge-500/30">
                <span className="text-white font-display font-bold">SF</span>
              </div>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
            <p className="text-dark-400 text-sm mt-1">Sign in to continue learning</p>
          </div>

          <LoginForm />
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-sky-500/5 border border-sky-500/20 rounded-xl text-center">
          <p className="text-sky-400 text-xs font-mono">
            💡 Demo: register first, then log in with your credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
