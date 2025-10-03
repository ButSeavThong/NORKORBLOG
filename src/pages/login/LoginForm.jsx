import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  fetchProfile,
  clearError,
} from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, loading, error, success } = useSelector(
    (state) => state.auth
  );

  console.log("Redux State:", { user, token, loading, error, success }); // Debug log

  const togglePassword = () => setShowPassword(!showPassword);

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    setValidationErrors({});

    if (!validateForm()) {
      console.log("Validation failed");
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log("Dispatching login with:", { username, password });

    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      console.log("Login successful, result:", result);
    } catch (err) {
      console.log("Login failed:", err);
      toast.error("Login failed: " + (err || "Unknown error"));
    }
  };

  // Load remember me preference on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Handle remember me
  useEffect(() => {
    if (rememberMe && username) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }
  }, [rememberMe, username]);

  // Fetch profile after login success and redirect
  // In LoginPage.jsx - replace the current redirect useEffect
  useEffect(() => {
    console.log("useEffect - Checking for redirect:", { success, token, user });

    if (success && token) {
      console.log("Login successful, token exists, redirecting to profile...");

      // Fetch profile first, then redirect
      dispatch(fetchProfile())
        .unwrap()
        .then((profileData) => {
          console.log("Profile fetched successfully:", profileData);
          toast.success("Login successful! Redirecting...");
          setTimeout(() => navigate("/profile"), 1000);
        })
        .catch((err) => {
          console.log("Profile fetch failed, but still redirecting:", err);
          toast.warning("Logged in, but couldn't load profile. Redirecting...");
          setTimeout(() => navigate("/profile"), 1000);
        });
    }
  }, [success, token, navigate, dispatch]);

  // Show general error toast
  useEffect(() => {
    if (error && !loading) {
      console.log("Showing error:", error);
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, loading, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left panel */}
        <div className="w-full md:w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-6 md:p-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
            alt="astro"
            className="w-28 md:w-40 mb-6"
          />
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">
            Welcome CAMPOST login form
          </h2>
          <p className="text-xs md:text-sm text-blue-100 text-center">
            Just a couple of clicks and we start
          </p>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Welcome To Form Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors((prev) => ({ ...prev, username: "" }));
                  }
                }}
                className={`w-full border rounded-lg px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 outline-none ${
                  validationErrors.username ? "border-red-500" : ""
                }`}
                disabled={loading}
                aria-label="Username"
                aria-invalid={!!validationErrors.username}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                className={`w-full border rounded-lg px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 outline-none ${
                  validationErrors.password ? "border-red-500" : ""
                }`}
                disabled={loading}
                aria-label="Password"
                aria-invalid={!!validationErrors.password}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs md:text-sm gap-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-xs md:text-sm">Or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-100 w-full sm:w-auto transition disabled:opacity-60"
                disabled={loading}
              >
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-100 w-full sm:w-auto transition disabled:opacity-60"
                disabled={loading}
              >
                <FaFacebook className="text-blue-600" /> Facebook
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-100 w-full sm:w-auto transition disabled:opacity-60"
                disabled={loading}
              >
                <FaGithub className="text-gray-800" /> Github
              </button>
            </div>
          </form>

          {/* Registration Link */}
          <p className="text-center text-xs md:text-sm mt-6 text-gray-600">
            Have no account yet?
          </p>
          <a
            href="/register"
            className="block text-center w-full py-2 border border-yellow-500 rounded-lg text-yellow-600 font-semibold hover:bg-yellow-50 mt-2 text-xs md:text-sm transition"
          >
            Registration
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
