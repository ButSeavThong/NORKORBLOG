import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Calendar, Clock, Edit, Trash2, MoreVertical } from "lucide-react";
import { deleteBlog } from "../../features/blog/blogSlice";
import { fetchUserBlogs } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const UserBlogCard = ({ blog, userId }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      setDeleting(true);
      try {
        await dispatch(deleteBlog(blog.id)).unwrap();
        toast.success("Blog deleted successfully!");
        // Refresh the user's blogs list
        dispatch(fetchUserBlogs(userId));
      } catch (error) {
        toast.error("Failed to delete blog");
        console.error("Delete blog error:", error);
      } finally {
        setDeleting(false);
        setShowMenu(false);
      }
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group relative">
      {/* Menu Button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <Link
              to={`/edit-blog/${blog.id}`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleEdit}
            >
              <Edit className="w-4 h-4" />
              Edit Story
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete Story"}
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail */}
      <Link to={`/blog/${blog.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={blog.thumbnail || "/placeholder-blog.jpg"}
            alt={blog.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Categories */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {blog.categories?.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(blog.created_at)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getReadingTime(blog.content)} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.id}`} className="block">
          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <Link to={`/blog/${blog.id}`} className="block">
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {blog.content}
          </p>
        </Link>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {blog.number_of_likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              {blog.number_of_bookmarks || 0}
            </span>
          </div>

          <Link
            to={`/blog/${blog.id}`}
            className="text-xs text-teal-600 font-medium hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBlogCard;
