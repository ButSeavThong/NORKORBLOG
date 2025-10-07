import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearError,
  uploadImage,
} from "../../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    }
  }, [success, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (error) dispatch(clearError());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.warn("Only PNG, JPG, JPEG files are allowed!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      setProfileFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast.warn("Username, Email, and Password are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      let profileUrl = "";

      if (profileFile) {
        setUploading(true);
        profileUrl = await dispatch(uploadImage(profileFile)).unwrap();
        setUploading(false);
      }

      const registrationData = {
        username: form.username,
        email: form.email,
        password: form.password,
        bio: form.bio,
        ...(profileUrl && { profileUrl }),
      };

      await dispatch(registerUser(registrationData)).unwrap();
    } catch (err) {
      setUploading(false);
      toast.error("Registration failed: " + (err || "Unknown error"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const isLoading = loading || uploading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-6 md:p-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
            alt="astro"
            className="w-28 md:w-40 mb-6"
          />
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">
            Welcome NORKORBLOG register form
          </h2>
          <p className="text-xs md:text-sm text-blue-100 text-center">
            Just a couple of clicks and we start
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
            Welcome To Form Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                autoComplete="username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Profile Upload */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Profile Image {profileFile && "(Will be uploaded)"}
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
                onClick={() => document.getElementById("profileUpload").click()}
              >
                {profileFile ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(profileFile)}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full mb-2 shadow-md"
                    />
                    <p className="text-xs text-gray-600">{profileFile.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileFile(null);
                      }}
                      className="mt-2 text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p className="text-sm">Click to upload</p>
                    <p className="text-xs">PNG, JPG, JPEG</p>
                    <p className="text-xs mt-1 text-blue-500">Optional</p>
                  </div>
                )}
              </div>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Bio</label>
              <textarea
                name="bio"
                placeholder="Sharing is caring"
                value={form.bio}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm md:text-base disabled:opacity-60 flex items-center justify-center"
            >
              {isLoading ? (
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
                  {uploading ? "Uploading Image..." : "Registering..."}
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="text-center text-xs md:text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
