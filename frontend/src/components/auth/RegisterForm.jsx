// components/auth/RegisterForm.jsx — Registration form

import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import Spinner from "../ui/Spinner";

const RegisterForm = () => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      showToast("Welcome to SkillForge! 🎉 +50 XP", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-dark-300 mb-1.5 font-mono">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Alex Johnson"
          required
          className="input"
        />
      </div>

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
          placeholder="Min. 6 characters"
          required
          minLength={6}
          className="input"
        />
      </div>

      {/* Role selector */}
      <div>
        <label className="block text-sm text-dark-300 mb-1.5 font-mono">I want to...</label>
        <div className="grid grid-cols-2 gap-2">
          {["student", "instructor"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
              className={`py-3 rounded-xl border font-display font-medium text-sm capitalize transition-all
                ${formData.role === r
                  ? "bg-forge-500/15 border-forge-500 text-forge-400"
                  : "border-dark-700 text-dark-400 hover:border-dark-600"
                }`}
            >
              {r === "student" ? "📚 Learn" : "🎓 Teach"}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Spinner size="sm" /> : null}
        {loading ? "Creating account..." : "Create account →"}
      </button>

      <p className="text-center text-dark-400 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-forge-400 hover:text-forge-300">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
