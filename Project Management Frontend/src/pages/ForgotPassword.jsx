import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../api/auth.api";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetToken, { newPassword });
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            PC
          </div>
          <span className="text-white text-xl font-bold">Project Camp</span>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Reset Password
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Enter your new password below
        </p>

        {error && (
          <p className="bg-red-950 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-950 text-green-400 p-3 rounded-lg mb-4 text-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">New Password</label>
            <div className="flex items-center bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Lock className="text-gray-500 mr-2" size={18} />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Confirm Password</label>
            <div className="flex items-center bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <Lock className="text-gray-500 mr-2" size={18} />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full outline-none bg-transparent text-white placeholder:text-gray-600 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;