import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  BookOpen,
  GraduationCap,
  Users,
  Clock,
  Calendar,
} from "lucide-react";
import {
  fetchAllBlogs,
  fetchCategories,
  setSearchQuery,
  setCurrentPage,
  clearFilters,
} from "../../features/blog/blogSlice";
import BlogCard from "../../components/blog/BlogCard";

const EducationPage = () => {
  const dispatch = useDispatch();
  const {
    blogs,
    loading,
    error,
    currentPage,
    totalPages,
    totalBlogs,
    hasMore,
    searchQuery,
  } = useSelector((state) => state.blog);

  const [localSearch, setLocalSearch] = useState("");
  const [educationBlogs, setEducationBlogs] = useState([]);

  // Load blogs with education filter
  const loadBlogs = (page, search = searchQuery) => {
    dispatch(
      fetchAllBlogs({
        page,
        page_size: 12,
        sort_by: "created_at",
        search,
        category: "Education", // Filter by Education category
      })
    );
  };

  // Initial load
  useEffect(() => {
    loadBlogs(1);
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter blogs for education content
  useEffect(() => {
    const eduBlogs = blogs.filter(
      (blog) =>
        blog.categories?.some(
          (cat) =>
            cat.name.toLowerCase().includes("education") ||
            cat.name.toLowerCase().includes("learning") ||
            cat.name.toLowerCase().includes("tutorial") ||
            blog.title.toLowerCase().includes("learn") ||
            blog.content.toLowerCase().includes("education")
        ) ||
        // Include blogs that are specifically about educational topics
        blog.title.toLowerCase().includes("guide") ||
        blog.title.toLowerCase().includes("tutorial") ||
        blog.title.toLowerCase().includes("how to") ||
        blog.title.toLowerCase().includes("learn")
    );
    setEducationBlogs(eduBlogs);
  }, [blogs]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        dispatch(setSearchQuery(localSearch));
        dispatch(setCurrentPage(1));
        loadBlogs(1, localSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, dispatch]);

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    loadBlogs(page, searchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear search
  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(clearFilters());
    loadBlogs(1, "");
  };

  // Get featured education blogs
  const featuredEducationBlogs = educationBlogs
    .filter((blog) => blog.number_of_likes > 5 || blog.number_of_bookmarks > 3)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <GraduationCap className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Education & Learning
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover comprehensive guides, tutorials, and educational content to
            enhance your knowledge and skills.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search educational articles, tutorials, guides..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Featured Education Blogs */}
      {featuredEducationBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Featured Learning Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredEducationBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      Featured
                    </span>
                    {blog.number_of_likes > 0 && (
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {blog.number_of_likes} likes
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.ceil(blog.content?.split(/\s+/).length / 200)} min
                      read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Educational Articles
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? `Search results for "${searchQuery}" in Education`
                : "Browse all educational content and learning resources"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{educationBlogs.length} educational articles</span>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && educationBlogs.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading educational content: {error}
            </p>
            <button
              onClick={() => loadBlogs(1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Education Blogs Grid */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {educationBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* No Results */}
            {educationBlogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery
                    ? "No educational articles found"
                    : "No educational content yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or browse all education content"
                    : "Check back later for educational articles and learning resources"}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse All Education Content
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && educationBlogs.length > 0 && (
          <div className="flex justify-center items-center gap-2 py-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;
