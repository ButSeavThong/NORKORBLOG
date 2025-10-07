import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  X,
  TrendingUp,
  Users,
  ChevronDown,
  BookOpen,
} from "lucide-react";
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

  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Load blogs with filters
  const loadBlogs = useCallback(
    (page, search = searchQuery, category = selectedCategory) => {
      console.log("🔄 Loading blogs:", { page, search, category });
      dispatch(
        fetchAllBlogs({
          page,
          page_size: 12,
          sort_by: "created_at",
          search: search || "",
          category: category || "",
        })
      );
    },
    [dispatch, searchQuery, selectedCategory]
  );

  // Initial load and categories fetch
  useEffect(() => {
    loadBlogs(1);
    dispatch(fetchCategories());
  }, [dispatch, loadBlogs]);

  // Debounce search
  useEffect(() => {
    if (localSearch === "" && searchQuery === "") {
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        console.log("🔍 Search triggered:", { localSearch, searchQuery });
        dispatch(setSearchQuery(localSearch));
        dispatch(setCurrentPage(1));
        loadBlogs(1, localSearch, selectedCategory);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, selectedCategory, dispatch, loadBlogs]);

  // Handle category filter
  const handleCategoryFilter = useCallback(
    (category) => {
      const newCategory = category === selectedCategory ? "" : category;
      console.log("🎯 Category filter:", {
        newCategory,
        previous: selectedCategory,
      });

      dispatch(setSelectedCategory(newCategory));
      dispatch(setCurrentPage(1));
      setActiveFilter(
        newCategory ? getCategoryNameById(categories, newCategory) : "All"
      );
      setShowCategoryDropdown(false);

      loadBlogs(1, searchQuery, newCategory);
    },
    [selectedCategory, searchQuery, dispatch, loadBlogs, categories]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page) => {
      console.log("📄 Page change:", page);
      dispatch(setCurrentPage(page));
      loadBlogs(page, searchQuery, selectedCategory);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch, loadBlogs, searchQuery, selectedCategory]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    console.log("🧹 Clearing all filters");
    setLocalSearch("");
    setActiveFilter("All");
    dispatch(clearFilters());
    setShowCategoryDropdown(false);
    loadBlogs(1, "", "");
  }, [dispatch, loadBlogs]);

  // Get category name by ID
  const getCategoryNameById = useCallback((categoriesList, categoryId) => {
    if (!categoryId) return "All Categories";
    const category = categoriesList.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest(".category-dropdown")) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (value === "" && searchQuery !== "") {
      dispatch(setSearchQuery(""));
      dispatch(setCurrentPage(1));
      loadBlogs(1, "", selectedCategory);
    }
  };

  // Handle search submit (when user presses enter)
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(setSearchQuery(localSearch));
      dispatch(setCurrentPage(1));
      loadBlogs(1, localSearch, selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="text-teal-600 block md:inline">Discover</span>{" "}
            <span className="text-teal-600 block md:inline">Amazing</span>{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block md:inline">
              Stories
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 lg:mb-12 max-w-xl mx-auto md:mx-0 text-pretty leading-relaxed">
            Explore insightful articles, tutorials, and stories from developers,
            designers, and creators around the world.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto md:mx-0 mb-4 md:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search articles, topics, or authors..."
              value={localSearch}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border border-gray-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  dispatch(setSearchQuery(""));
                  dispatch(setCurrentPage(1));
                  loadBlogs(1, "", selectedCategory);
                }}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative category-dropdown max-w-lg mx-auto md:mx-0">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border border-gray-200 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <span className="text-gray-700 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
                  {getCategoryNameById(categories, selectedCategory)}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showCategoryDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg max-h-60 sm:max-h-80 overflow-y-auto">
                <div className="p-1 sm:p-2">
                  {/* All Categories Option */}
                  <button
                    onClick={() => handleCategoryFilter("")}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 text-left rounded-lg sm:rounded-xl transition-colors ${
                      !selectedCategory
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-500 flex-shrink-0"></div>
                    <span className="font-medium text-sm sm:text-base">
                      All Categories
                    </span>
                  </button>

                  <div className="border-t border-gray-100 my-1 sm:my-2"></div>

                  {/* Categories List */}
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 text-left rounded-lg sm:rounded-xl transition-colors ${
                        selectedCategory === category.id
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                          selectedCategory === category.id
                            ? "bg-teal-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base block truncate">
                          {category.name}
                        </span>
                        {category.description && (
                          <span className="text-xs sm:text-sm text-gray-500 block mt-0.5 sm:mt-1 line-clamp-1">
                            {category.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}

                  {/* No Categories State */}
                  {categories.length === 0 && (
                    <div className="text-center py-4 sm:py-6 text-gray-500">
                      <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                      <p className="text-sm sm:text-base">
                        No categories available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Hero Image */}
        <div className="relative order-1 md:order-2">
          <img
            src="/hero.png"
            alt="Technology blogging illustration"
            className="rounded-xl md:rounded-2xl shadow-lg w-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl md:rounded-2xl"></div>
        </div>
      </div>

      {/* Current Filters Display */}
      {(searchQuery || selectedCategory) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base">
                  {selectedCategory && (
                    <span className="text-teal-700 font-medium whitespace-nowrap">
                      Category:{" "}
                      {getCategoryNameById(categories, selectedCategory)}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="text-teal-700 font-medium whitespace-nowrap">
                      {selectedCategory && " • "}
                      Search: "{searchQuery}"
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-teal-600 hover:text-teal-800 transition-colors flex-shrink-0 ml-1"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left whitespace-nowrap">
                Showing {blogs.length} of {totalBlogs} articles
                {selectedCategory && (
                  <span className="text-teal-600 font-medium">
                    {" "}
                    in {getCategoryNameById(categories, selectedCategory)}
                  </span>
                )}
                {searchQuery && (
                  <span className="text-teal-600 font-medium">
                    {" "}
                    matching "{searchQuery}"
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory
                ? getCategoryNameById(categories, selectedCategory)
                : "Featured"}{" "}
              Articles
              {searchQuery && (
                <span className="text-lg sm:text-xl font-normal text-teal-600">
                  {" "}
                  matching "{searchQuery}"
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm md:text-base">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{totalBlogs} articles published</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && blogs.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-40 sm:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-2 mt-3 sm:mt-4">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Error loading blogs: {error}
            </p>
            <button
              onClick={() => loadBlogs(1)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* No Results */}
            {blogs.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-3 sm:mb-4">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                  {searchQuery || selectedCategory
                    ? "Try adjusting your search or filters"
                    : "No articles available yet"}
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 py-6 md:py-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-10 h-10 px-2 sm:px-0 rounded-lg transition-colors text-sm sm:text-base font-medium ${
                      currentPage === pageNum
                        ? "bg-teal-600 text-white shadow-sm"
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
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
            >
              Next
            </button>
          </div>
        )}

        {/* Load More Button (Alternative to pagination) */}
        {hasMore && blogs.length > 0 && (
          <div className="flex justify-center py-6 md:py-8">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center text-sm sm:text-base font-medium"
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
