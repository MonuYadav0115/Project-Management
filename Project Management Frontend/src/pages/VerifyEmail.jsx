import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendEmailVerification } from "../api/auth.api";
import { Mail, CheckCircle, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const { verificationToken } = useParams();
  const navigate = useNavigate();

  // page open hote hi automatically verify karo
  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(verificationToken);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
        setError(err.response?.data?.message || "Verification failed");
      }
    };

    verify();
  }, [verificationToken]);

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess("");
    try {
      await resendEmailVerification();
      setResendSuccess("Verification email sent! Please check your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">

        {/* Loading state */}
        {status === "loading" && (
          <>
            <Mail className="mx-auto text-blue-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        )}

        {/* Success state */}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-500 mb-6">
              Your email has been verified successfully. Redirecting to
              login...
            </p>
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Go to Login
            </Link>
          </>
        )}

        {/* Error state */}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h2>
            <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </p>

            {resendSuccess && (
              <p className="bg-green-100 text-green-600 p-3 rounded-lg mb-4 text-sm">
                {resendSuccess}
              </p>
            )}

            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md mb-4"
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
