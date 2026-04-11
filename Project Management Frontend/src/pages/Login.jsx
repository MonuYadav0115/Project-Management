import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth.api";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ email, password });
      login(res.data.data.user, res.data.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">

      <div className="bg-[#1a1a2e] p-10 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Logo - same as Register page */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            PC
          </div>
          <span className="text-white text-xl font-bold">Project Camp</span>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 mb-6">Login to continue</p>

        {error && (
          <p className="bg-red-900/40 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <div className="flex items-center bg-[#0f0f1a] border border-gray-700 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Mail className="text-gray-500 mr-2" size={18} />
              <input
                type="email"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600 text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Password</label>
            <div className="flex items-center bg-[#0f0f1a] border border-gray-700 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Lock className="text-gray-500 mr-2" size={18} />
              <input
                type="password"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600 text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-right mt-2">
          <Link to="/forgot-password" className="text-sm text-indigo-400 hover:underline">
            Forgot password?
          </Link>
        </p>

        {/* Register */}
        <p className="text-center text-gray-500 mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;