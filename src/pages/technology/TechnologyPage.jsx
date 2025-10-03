import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Cpu, Code, Users, Clock, Calendar, Zap } from "lucide-react";
import {
  fetchAllBlogs,
  fetchCategories,
  setSearchQuery,
  setCurrentPage,
  clearFilters,
} from "../../features/blog/blogSlice";
import BlogCard from "../../components/blog/BlogCard";

const TechnologyPage = () => {
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
  const [technologyBlogs, setTechnologyBlogs] = useState([]);

  // Load blogs with technology filter
  const loadBlogs = (page, search = searchQuery) => {
    dispatch(
      fetchAllBlogs({
        page,
        page_size: 12,
        sort_by: "created_at",
        search,
        category: "Technology", // Filter by Technology category
      })
    );
  };

  // Initial load
  useEffect(() => {
    loadBlogs(1);
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter blogs for technology content
  useEffect(() => {
    const techBlogs = blogs.filter(
      (blog) =>
        blog.categories?.some(
          (cat) =>
            cat.name.toLowerCase().includes("technology") ||
            cat.name.toLowerCase().includes("tech") ||
            cat.name.toLowerCase().includes("programming") ||
            cat.name.toLowerCase().includes("coding") ||
            cat.name.toLowerCase().includes("software") ||
            cat.name.toLowerCase().includes("web development") ||
            cat.name.toLowerCase().includes("mobile") ||
            cat.name.toLowerCase().includes("ai") ||
            cat.name.toLowerCase().includes("machine learning") ||
            cat.name.toLowerCase().includes("cloud") ||
            cat.name.toLowerCase().includes("devops")
        ) ||
        // Include blogs that are specifically about technology topics
        blog.title.toLowerCase().includes("javascript") ||
        blog.title.toLowerCase().includes("python") ||
        blog.title.toLowerCase().includes("react") ||
        blog.title.toLowerCase().includes("node") ||
        blog.title.toLowerCase().includes("api") ||
        blog.title.toLowerCase().includes("database") ||
        blog.title.toLowerCase().includes("algorithm") ||
        blog.title.toLowerCase().includes("framework")
    );
    setTechnologyBlogs(techBlogs);
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

  // Get trending technology blogs
  const trendingTechBlogs = technologyBlogs
    .filter((blog) => blog.number_of_likes > 3)
    .slice(0, 4);

  // Get technology categories from current blogs
  const techCategories = [
    ...new Set(
      technologyBlogs.flatMap(
        (blog) => blog.categories?.map((cat) => cat.name) || []
      )
    ),
  ].slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Cpu className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Technology & Innovation
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore the latest in technology, programming, software development,
            and cutting-edge innovations.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search technology articles, programming tutorials, tech news..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Trending Technology Blogs */}
      {trendingTechBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Trending in Tech
              </h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                Hot Topics
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingTechBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                      Trending
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {blog.number_of_likes}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {blog.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tech Categories */}
      {techCategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Technology Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {techCategories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  {category}
                </span>
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
              Technology Articles
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? `Search results for "${searchQuery}" in Technology`
                : "Latest technology insights, programming guides, and tech innovations"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{technologyBlogs.length} technology articles</span>
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
        {loading && technologyBlogs.length === 0 && (
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
              Error loading technology content: {error}
            </p>
            <button
              onClick={() => loadBlogs(1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Technology Blogs Grid */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {technologyBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* No Results */}
            {technologyBlogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Cpu className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery
                    ? "No technology articles found"
                    : "No technology content yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or browse all technology content"
                    : "Check back later for technology articles and programming resources"}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse All Technology Content
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && technologyBlogs.length > 0 && (
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

export default TechnologyPage;
