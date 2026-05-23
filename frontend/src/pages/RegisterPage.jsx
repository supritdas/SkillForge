// pages/RegisterPage.jsx — Registration page

import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[400px] bg-forge-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="card border-dark-700">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-forge-gradient rounded-xl flex items-center justify-center shadow-lg shadow-forge-500/30">
                <span className="text-white font-display font-bold">SF</span>
              </div>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white">Create your account</h1>
            <p className="text-dark-400 text-sm mt-1">Join thousands of learners on SkillForge</p>
          </div>

          {/* XP welcome bonus */}
          <div className="flex items-center gap-2 p-3 bg-forge-500/5 border border-forge-500/20 rounded-xl mb-6">
            <span className="text-xl">⚡</span>
            <p className="text-forge-300 text-sm font-mono">+50 XP just for signing up!</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
