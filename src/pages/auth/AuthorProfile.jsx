import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  fetchUserBlogs,
  clearAuthorProfile,
} from "../../features/auth/authSlice";
import { Calendar, Users, BookOpen, ArrowLeft } from "lucide-react";
import BlogCard from "../../components/blog/BlogCard";

const AuthorProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { authorProfile, authorBlogs, authorLoading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userId) {
      console.log("Fetching author profile for:", userId);
      dispatch(fetchUserById(userId));
      dispatch(fetchUserBlogs(userId));
    }

    return () => {
      dispatch(clearAuthorProfile());
    };
  }, [userId, dispatch]);

  if (authorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link to="/" className="text-teal-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle different response structures
  const getAuthorData = () => {
    if (!authorProfile) return null;

    // If authorProfile has a profile object (from fetchUserById)
    if (authorProfile.profile) {
      return authorProfile.profile;
    }
    // If authorProfile is the profile itself (direct response)
    return authorProfile;
  };

  const getAuthorBlogs = () => {
    if (!authorBlogs) return [];

    // Handle different response structures
    if (Array.isArray(authorBlogs)) {
      return authorBlogs;
    }
    if (authorBlogs.blogs && Array.isArray(authorBlogs.blogs)) {
      return authorBlogs.blogs;
    }
    if (authorBlogs.data && Array.isArray(authorBlogs.data)) {
      return authorBlogs.data;
    }

    return [];
  };

  const authorData = getAuthorData();
  const blogs = getAuthorBlogs();

  // Safety check - ensure blogs is always an array
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  if (!authorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Author not found</p>
      </div>
    );
  }


  const getJoinDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all blogs
        </Link>

        {/* Author Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={authorData.profileUrl || "/default-avatar.png"}
                  alt={authorData.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Author Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {authorData.username}
                </h1>

                <p className="text-gray-600 mb-6 max-w-2xl">
                  {authorData.bio || "No bio yet"}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Joined {getJoinDate(authorData.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-5 h-5" />
                    <span>
                      {safeBlogs.length}{" "}
                      {safeBlogs.length === 1 ? "article" : "articles"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{authorData.followers || 0} followers</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-6">
                  <p className="text-gray-500 text-sm">{authorData.email}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Follow
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Blogs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Articles by {authorData.username}
            </h2>
            <span className="text-gray-500">
              {safeBlogs.length}{" "}
              {safeBlogs.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {/* Blogs Grid */}
          {safeBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {authorData.username} hasn't published any articles yet.
              </p>
            </div>
          )}
        </div>

        {/* Popular Articles Section */}
        {safeBlogs.length > 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Most Popular Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[...safeBlogs] // Create a copy to avoid mutating the original array
                .sort(
                  (a, b) => (b.number_of_likes || 0) - (a.number_of_likes || 0)
                )
                .slice(0, 2)
                .map((blog) => (
                  <div
                    key={blog.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-teal-200 transition-colors"
                  >
                    <Link to={`/blog/${blog.id}`} className="block">
                      <h4 className="font-semibold text-gray-900 hover:text-teal-600 transition-colors mb-2">
                        {blog.title}
                      </h4>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {blog.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{blog.number_of_likes || 0} likes</span>
                        <span>{blog.number_of_bookmarks || 0} bookmarks</span>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
