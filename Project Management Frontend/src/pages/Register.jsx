import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { User, Mail, Lock } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await registerUser(formData);
      setSuccess("Registration successful! Please verify your email.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0f1117" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl border border-white/10"
        style={{ backgroundColor: "#1a1d27" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">PC</span>
          </div>
          <span className="text-white font-bold text-lg">Project Camp</span>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Register to start managing your projects
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-4 text-sm border border-red-500/20">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded-xl mb-4 text-sm border border-green-500/20">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Full Name
            </label>
            <div
              className="flex items-center rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition"
              style={{ backgroundColor: "#0f1117" }}
            >
              <User size={16} className="text-gray-600 mr-2 flex-shrink-0" />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full outline-none bg-transparent text-white text-sm placeholder-gray-600"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Username
            </label>
            <div
              className="flex items-center rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition"
              style={{ backgroundColor: "#0f1117" }}
            >
              <User size={16} className="text-gray-600 mr-2 flex-shrink-0" />
              <input
                type="text"
                name="username"
                placeholder="Enter username (lowercase)"
                className="w-full outline-none bg-transparent text-white text-sm placeholder-gray-600"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <div
              className="flex items-center rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition"
              style={{ backgroundColor: "#0f1117" }}
            >
              <Mail size={16} className="text-gray-600 mr-2 flex-shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full outline-none bg-transparent text-white text-sm placeholder-gray-600"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Password
            </label>
            <div
              className="flex items-center rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition"
              style={{ backgroundColor: "#0f1117" }}
            >
              <Lock size={16} className="text-gray-600 mr-2 flex-shrink-0" />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full outline-none bg-transparent text-white text-sm placeholder-gray-600"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;