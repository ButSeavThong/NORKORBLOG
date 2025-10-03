import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, X, TrendingUp, Users } from "lucide-react";
import {
  fetchAllBlogs,
  fetchCategories,
  setSearchQuery,
  setSelectedCategory,
  setCurrentPage,
  clearFilters,
} from "../../features/blog/blogSlice";
import BlogCard from "../../components/blog/BlogCard";

const HomePage = () => {
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
    selectedCategory,
    categories,
  } = useSelector((state) => state.blog);

  const [localSearch, setLocalSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Load blogs with filters
  const loadBlogs = (
    page,
    search = searchQuery,
    category = selectedCategory
  ) => {
    dispatch(
      fetchAllBlogs({
        page,
        page_size: 12,
        sort_by: "created_at",
        search,
        category,
      })
    );
  };

  // Initial load and categories fetch
  useEffect(() => {
    loadBlogs(1);
    dispatch(fetchCategories());
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        dispatch(setSearchQuery(localSearch));
        dispatch(setCurrentPage(1));
        loadBlogs(1, localSearch, selectedCategory);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, selectedCategory, dispatch]);

  // Handle category filter
  const handleCategoryFilter = (category) => {
    const newCategory = category === selectedCategory ? "" : category;
    dispatch(setSelectedCategory(newCategory));
    dispatch(setCurrentPage(1));
    loadBlogs(1, searchQuery, newCategory);
    setActiveFilter(category === selectedCategory ? "All" : category);
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    loadBlogs(page, searchQuery, selectedCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocalSearch("");
    setActiveFilter("All");
    dispatch(clearFilters());
    loadBlogs(1, "", "");
  };

  // Get unique categories from current blogs for quick filter
  const availableCategories = [
    ...new Set(
      blogs.flatMap((blog) => blog.categories?.map((cat) => cat.name) || [])
    ),
  ];

  // Quick filter buttons (similar to your original design)
  const filters = [
    "All",
    "Technology",
    "Web Development",
    "Design",
    "JavaScript",
    "React",
    "Career",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section - Same as your original design */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-teal-600">Discover</span>{" "}
            <span className="text-teal-600">Amazing</span>{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Stories
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-xl text-pretty">
            Explore insightful articles, tutorials, and stories from developers,
            designers, and creators around the world.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, topics, or authors..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  if (filter === "All") {
                    handleClearFilters();
                  } else {
                    handleCategoryFilter(filter);
                  }
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Hero Image */}
        <div className="relative">
          <img
            src="/hero.png"
            alt="Technology blogging illustration"
            className="rounded-2xl shadow-lg w-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {(searchQuery || selectedCategory) && (
                  <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(searchQuery ? 1 : 0) + (selectedCategory ? 1 : 0)}
                  </span>
                )}
              </button>

              {(searchQuery || selectedCategory) && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Showing {blogs.length} of {totalBlogs} articles
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.name
                        ? "bg-teal-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Category Filters */}
          {availableCategories.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Popular Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableCategories.slice(0, 8).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Articles Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Articles
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{totalBlogs} articles published</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && blogs.length === 0 && (
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
            <p className="text-red-600 mb-4">Error loading blogs: {error}</p>
            <button
              onClick={() => loadBlogs(1)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* No Results */}
            {blogs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory
                    ? "Try adjusting your search or filters"
                    : "No articles available yet"}
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
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
                        ? "bg-teal-600 text-white"
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

        {/* Load More Button (Alternative to pagination) */}
        {hasMore && blogs.length > 0 && (
          <div className="flex justify-center py-8">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={loading}
              className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                "Load More Articles"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
