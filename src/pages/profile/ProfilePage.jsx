import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchProfile,
  logout,
  fetchUserBlogs,
} from "../../features/auth/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserBlogCard from "../../components/blog/UserBlogCard";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, authorBlogs, authorLoading } = useSelector(
    (state) => state.auth
  );

  console.log("🔍 ProfilePage State:", { user, authorBlogs, authorLoading });

  useEffect(() => {
    // Redirect to login if no token
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch profile if token exists but user data is missing
    if (token && !user) {
      dispatch(fetchProfile());
    }

    // Fetch user's blogs when user data is available
    if (user && token) {
      const userId = user.profile?.id || user.id;
      console.log("📚 Fetching blogs for user:", userId);
      dispatch(fetchUserBlogs(userId));
    }
  }, [token, user, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile</p>
          <button
            onClick={handleLogout}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const userData = user.profile || user;
  const userBlogs = authorBlogs || [];
  const userId = userData.id || user.id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={userData.profileUrl || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {userData.username || "User"}
                </h1>
                <p className="text-gray-600 mb-4">
                  {userData.bio || "No bio yet"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>Joined {formatDate(userData.created_at)}</span>
                  <span>•</span>
                  <span>{userData.email}</span>
                  <span>•</span>
                  <span>
                    {userBlogs.length}{" "}
                    {userBlogs.length === 1 ? "story" : "stories"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Link
                  to="/create-blog"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors"
                >
                  Write Story
                </Link>
                <Link
                  to="/edit-profile"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-8">
              <button className="py-4 px-1 border-b-2 border-blue-600 text-sm font-medium text-blue-600">
                Stories ({userBlogs.length})
              </button>
              <Link
                to="/create-blog"
                className="flex items-center gap-2 py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Write Story
              </Link>
              <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Drafts
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Stats
              </button>
            </nav>
          </div>

          {/* Content Area - User's Stories */}
          <div className="p-8">
            {authorLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : userBlogs.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Stories ({userBlogs.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    Click the ••• menu on each card to edit or delete
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBlogs.map((blog) => (
                    <UserBlogCard key={blog.id} blog={blog} userId={userId} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No stories yet
                </h3>
                <p className="text-gray-500 mb-6">
                  When you write your first story, it will appear here.
                </p>
                <Link
                  to="/create-blog"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Write your first story
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
