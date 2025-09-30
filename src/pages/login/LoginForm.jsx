import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // <-- added

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and Password are required!");
      return;
    }

    try {
      const res = await fetch("https://blog-api.devnerd.store/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // sending JSON
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials or server error");
      }

      const data = await res.json();
      console.log("Login Response:", data);

      // Expecting: { accessToken: "...", refreshToken: "..." }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      alert("Login successful! Redirecting to profile...");
      navigate("/profile");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login failed: " + err.message);
    }
  };

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
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Remember me + forgot */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs md:text-sm gap-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm md:text-base"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-xs md:text-sm">Or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Social logins (dummy for now) */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-100 w-full sm:w-auto"
              >
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-100 w-full sm:w-auto"
              >
                <FaFacebook className="text-blue-600" /> Facebook
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-100 w-full sm:w-auto"
              >
                <FaGithub className="text-gray-800" /> Github
              </button>
            </div>
          </form>

          {/* Register link */}
          <p className="text-center text-xs md:text-sm mt-6 text-gray-600">
            Have no account yet?
          </p>
          <a
            href="/register"
            className="block text-center w-full py-2 border border-yellow-500 rounded-lg text-yellow-600 font-semibold hover:bg-yellow-50 mt-2 text-xs md:text-sm"
          >
            Registration
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
