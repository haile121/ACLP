import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "../utils/api.js";
import { saveTokens, isMember } from "../utils/auth.js";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("register"); // register | otp
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validation
    if (!fullName || !email || !password || !phone) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Validate phone number format (phone already includes country code from PhoneInput)
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup(fullName, email, `+${phone}`, password);
      
      if (response.success) {
        setStep("otp");
        setMessage("Registration successful! An OTP has been sent to your email. Please check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Signup error:", err);
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
      const response = await authAPI.resendSignupOTP(email);
      
      if (response.success) {
        setMessage("OTP has been resent to your email. Please check your inbox.");
        setResendTimer(60); // Reset timer to 60 seconds
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
      const response = await authAPI.verifySignupOTP(email, otp);
      
      if (response.success && response.data) {
        // Save tokens and user data
        saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        
        setMessage("✅ Registration successful! Redirecting...");
        
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
            Join Now
          </h2>
          <p className="text-gray-500 text-sm">
            Create your account Here
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

        {/* Registration Step */}
        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

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
                Phone Number
              </label>
              <div className="mt-2">
                <div className="phone-input-wrapper">
                <PhoneInput
  country="et"
  value={phone}
  onChange={(value) => setPhone(value)}
  enableSearch
  specialLabel=""
  containerStyle={{ width: "100%" }}
  inputStyle={{
    width: "100%",
    height: "48px",
    borderRadius: "0.5rem",
    paddingLeft: "58px", // IMPORTANT
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  }}
  buttonStyle={{
    borderRadius: "0.5rem 0 0 0.5rem",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
  }}
  dropdownStyle={{
    borderRadius: "0.5rem",
  }}
  inputProps={{
    required: true,
    autoComplete: "tel",
  }}
/>

                </div>
              </div>
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
                  placeholder="Create a password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 disabled:opacity-60 shadow-sm"
            >
              {loading ? "Creating account..." : "Join Now"}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={handleOTP} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Enter OTP</h3>
            <p className="text-sm text-gray-500">
              Please check your email or phone for the 6-digit verification code.
            </p>
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
            />
            
            <div className="flex items-center justify-between">
              <p
                onClick={() => {
                  setStep("register");
                  setResendTimer(0);
                }}
                className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
              >
                ← Back to Registration
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
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-blue-700 hover:text-blue-800 hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
