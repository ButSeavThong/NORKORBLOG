import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Heart, Bookmark } from "lucide-react";

const BlogCard = ({ blog }) => {
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

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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
        {/* Author Info - Make this clickable */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            to={`/author/${blog.author?.id || blog.author_id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={blog.author?.profileUrl || "/default-avatar.png"}
              alt={blog.author?.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate hover:text-teal-600 transition-colors">
                {blog.author?.username}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(blog.created_at)}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{getReadingTime(blog.content)} min read</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.id}`} className="block">
          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <Link to={`/blog/${blog.id}`} className="block">
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {blog.content}
          </p>
        </Link>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{blog.number_of_likes || 0}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <Bookmark className="w-4 h-4" />
              <span>{blog.number_of_bookmarks || 0}</span>
            </button>
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

export default BlogCard;
