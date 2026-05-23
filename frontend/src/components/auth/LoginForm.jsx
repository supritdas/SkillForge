// components/auth/LoginForm.jsx — Login form with validation

import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import Spinner from "../ui/Spinner";

const LoginForm = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Generic change handler for all inputs
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      showToast("Welcome back! 👋", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-dark-300 mb-1.5 font-mono">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="input"
        />
      </div>

      <div>
        <label className="block text-sm text-dark-300 mb-1.5 font-mono">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          minLength={6}
          className="input"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Spinner size="sm" /> : null}
        {loading ? "Signing in..." : "Sign in →"}
      </button>

      <p className="text-center text-dark-400 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-forge-400 hover:text-forge-300">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
