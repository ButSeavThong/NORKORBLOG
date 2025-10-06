import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserProfile,
  uploadImage,
  fetchProfile,
  clearError,
  clearUpdateSuccess,
} from "../../features/auth/authSlice";
import { ArrowLeft, Upload, X, User, Mail } from "lucide-react";
import { toast } from "react-toastify";

const EditProfile = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, profileLoading, uploadLoading, updateSuccess, error } =
    useSelector((state) => state.auth);

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      const userData = user.profile || user;
      setForm({
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
      });
      setProfileImageUrl(userData.profileUrl || "");
    }
  }, [user]);

  // Handle success and errors
  useEffect(() => {
    if (updateSuccess && isSubmitted) {
      toast.success("Profile updated successfully!");
      setIsSubmitted(false);
      // Refresh the profile data
      dispatch(fetchProfile());
      navigate("/profile");
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    return () => {
      dispatch(clearUpdateSuccess());
    };
  }, [updateSuccess, error, isSubmitted, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (PNG, JPG, JPEG, WebP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);

      try {
        // Upload image and get URL
        const url = await dispatch(uploadImage(file)).unwrap();

        if (!url) {
          throw new Error("No URL returned from upload");
        }

        setProfileImageUrl(url);
        toast.success("Profile image uploaded successfully!");
      } catch (err) {
        toast.error("Failed to upload image: " + (err.message || err));
        setProfileImage(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validation
    if (!form.username.trim()) {
      toast.error("Please enter a username");
      setIsSubmitted(false);
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter an email");
      setIsSubmitted(false);
      return;
    }

    // Prepare profile data
    const profileData = {
      username: form.username,
      email: form.email,
      bio: form.bio,
      ...(profileImageUrl && { profileUrl: profileImageUrl }),
    };

    console.log("Updating profile with:", profileData);

    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      // Success is handled in useEffect
    } catch (err) {
      console.error("Update profile error:", err);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          <p className="text-gray-600">
            Update your personal information and profile picture.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Picture
            </h2>

            <div className="flex flex-col items-center space-y-4">
              {/* Current Profile Image */}
              <div className="relative">
                {profileImageUrl ? (
                  <>
                    <img
                      src={profileImageUrl}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="flex flex-col items-center justify-center w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors bg-gray-50 py-4">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG, WebP (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadLoading}
                />
              </label>

              {uploadLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Uploading image...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your username"
                    maxLength={50}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {form.username.length}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={profileLoading || uploadLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileLoading || uploadLoading}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {profileLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
