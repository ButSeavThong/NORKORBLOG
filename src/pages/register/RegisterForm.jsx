import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom"; // <-- add useNavigate

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [profileFile, setProfileFile] = useState(null);

  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // handle file change
  const handleFileChange = (e) => {
    setProfileFile(e.target.files[0]); // save selected file
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.username || !form.email || !form.password) {
      alert("Username, Email, and Password are required!");
      return;
    }

    try {
      // if backend expects file upload → use FormData
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("bio", form.bio);

      if (profileFile) {
        formData.append("profileUrl", profileFile);
      }

      const res = await fetch("https://blog-api.devnerd.store/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to register");
      }

      const data = await res.json();
      console.log("Server Response:", data);

      alert("Registration successful! Redirecting to login...");
      navigate("/login"); // redirect after success
    } catch (err) {
      console.error("Error:", err);
      alert("Registration failed: " + err.message);
    }
  }

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
            Welcome CAMPOST register form
          </h2>
          <p className="text-xs md:text-sm text-blue-100 text-center">
            Just a couple of clicks and we start
          </p>
        </div>

        {/* Right panel */}
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
                Profile Image
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
              className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm md:text-base"
            >
              Register
            </button>
          </form>

          {/* Already have account */}
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
