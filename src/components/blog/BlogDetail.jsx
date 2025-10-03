import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, clearError } from "../../features/blog/blogSlice"; // Remove clearCurrentBlog
import {
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Share,
  ArrowLeft,
} from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBlog, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }

    // Cleanup function - just clear error if clearCurrentBlog doesn't exist
    return () => {
      dispatch(clearError());
      // If clearCurrentBlog exists, use it, otherwise just clear error
      // dispatch(clearCurrentBlog()); // Comment out if causing error
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link to="/" className="text-teal-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Blog not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all blogs
        </Link>

        {/* Blog Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Thumbnail */}
          <img
            src={currentBlog.thumbnail || "/placeholder-blog.jpg"}
            alt={currentBlog.title}
            className="w-full h-64 object-cover"
          />

          <div className="p-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentBlog.categories?.map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {currentBlog.title}
            </h1>

            {/* Author Info and Meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link
                  to={`/author/${
                    currentBlog.author?.id || currentBlog.author_id
                  }`}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={
                      currentBlog.author?.profileUrl || "/default-avatar.png"
                    }
                    alt={currentBlog.author?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                      {currentBlog.author?.username}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(currentBlog.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getReadingTime(currentBlog.content)} min read
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{currentBlog.number_of_likes || 0}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span>{currentBlog.number_of_bookmarks || 0}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bio */}
            {currentBlog.author?.bio && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 italic">
                  {currentBlog.author.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentBlog.content}
            </p>
          </div>
        </div>

        {/* Related Blogs Section (Placeholder for now) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More from CAMPOST
          </h2>
          <p className="text-gray-600 text-center py-8">
            More related blogs will be displayed here soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
