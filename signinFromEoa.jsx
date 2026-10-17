import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "../utils/api.js";
import { saveTokens, isMember } from "../utils/auth.js";

const Signin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login | forgot | otp
  const [otpType, setOtpType] = useState("login"); // login | password_reset - tracks which flow we're in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setOtpType("login");
        setStep("otp");
        setMessage("An OTP has been sent to your email. Please check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        setOtpType("password_reset");
        setMessage("Reset OTP has been sent to your email.");
        setStep("otp");
      }
    } catch (err) {
      setError(err.message || "Failed to send reset OTP. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => timer - 1);
      }, 1000);
    } else if (resendTimer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Start timer when OTP step is shown
  useEffect(() => {
    if (step === "otp" && resendTimer === 0) {
      setResendTimer(60); // 60 seconds countdown
    }
  }, [step]);

  const handleResendOTP = async () => {
    if (resendTimer > 0 || resending) return;

    setResending(true);
    setError("");
    setMessage("");

    try {
      if (otpType === "login") {
        const response = await authAPI.resendLoginOTP(email);
        if (response.success) {
          setMessage("Login OTP has been resent to your email. Please check your inbox.");
          setResendTimer(60);
        }
      } else {
        // Password reset - use forgotPassword endpoint
        const response = await authAPI.forgotPassword(email);
        if (response.success) {
          setMessage("Password reset OTP has been resent to your email.");
          setResendTimer(60);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", err);
    } finally {
      setResending(false);
    }
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      // Handle login OTP verification
      if (otpType === "login") {
        const response = await authAPI.verifyLoginOTP(email, otp);
        
        if (response.success && response.data) {
          // Save tokens and user data
          saveTokens(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.user
          );
          
          setMessage("✅ Verified successfully! Redirecting...");
          
          // Redirect after a short delay based on membership status
          setTimeout(() => {
            // Check if user is an approved member
            if (isMember()) {
              navigate("/member-portal"); // Redirect to member portal for members
            } else {
              navigate("/"); // Redirect to home page for non-members
            }
          }, 1500);
        }
      } else {
        // Password reset flow
        // Validate password fields
        if (!newPassword || !confirmPassword) {
          setError("Please enter both password fields");
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        // Reset password with OTP
        const response = await authAPI.resetPassword(email, otp, newPassword);
        
        if (response.success) {
          setMessage("✅ Password reset successful! Redirecting to login...");
          
          // Clear form and redirect to login after a short delay
          setTimeout(() => {
            setStep("login");
            setOtpType("login");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
            setMessage("");
            setResendTimer(0);
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-800 mb-2 tracking-tight">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to continue to your member dashboard
          </p>
        </div>

        {error && (
          <div className="text-sm text-center mb-5 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div
            className={`text-sm text-center mb-5 ${
              message.includes("✅") ? "text-green-600 bg-green-50 p-3 rounded-lg border border-green-200" : "text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Login Step */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setStep("forgot")}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 disabled:opacity-60 shadow-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Forgot Password Step */}
        {step === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">
              Reset your password
            </h3>
            <p className="text-sm text-gray-500">
              Enter your registered email, and we’ll send you an OTP to reset your password.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-60 shadow-sm"
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
            <p
              onClick={() => setStep("login")}
              className="text-sm text-center text-gray-600 hover:text-blue-600 cursor-pointer mt-2"
            >
              ← Back to Sign In
            </p>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={handleOTP} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">
              {otpType === "password_reset" ? "Reset Password" : "Enter OTP"}
            </h3>
            <p className="text-sm text-gray-500">
              {otpType === "password_reset" 
                ? "Please check your email for the 6-digit code, then enter your new password."
                : "Please check your email for the 6-digit code."}
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setOtp(value);
                }}
                className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="••••••"
                required
              />
            </div>

            {/* Password fields for password reset */}
            {otpType === "password_reset" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <p
                onClick={() => {
                  setStep(otpType === "password_reset" ? "forgot" : "login");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setResendTimer(0);
                }}
                className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
              >
                ← Back to {otpType === "password_reset" ? "Forgot Password" : "Sign In"}
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || resending}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {resending
                  ? "Sending..."
                  : resendTimer > 0
                  ? `Resend OTP (${resendTimer}s)`
                  : "Resend OTP"}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-60 shadow-sm"
            >
              {loading 
                ? (otpType === "password_reset" ? "Resetting Password..." : "Verifying...") 
                : (otpType === "password_reset" ? "Reset Password" : "Verify OTP")}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <a
            href="/join"
            className="text-blue-700 hover:text-blue-800 hover:underline font-medium"
          >
            Register here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signin;
