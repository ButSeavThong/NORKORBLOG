import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, TrendingUp, Users } from "lucide-react";
import { fetchAllBlogs } from "../../features/blog/blogSlice";
import BlogCard from "../blog/BlogCard";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const dispatch = useDispatch();

  const { blogs, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchAllBlogs({ page_size: 11, page: 1, sort_by: "created_at" }));
  }, [dispatch]);

  const filters = [
    "All",
    "Technology",
    "Web Development",
    "Design",
    "JavaScript",
    "React",
    "Career",
  ];

  // Filter blogs based on search and active filter
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      blog.categories?.some((cat) =>
        cat.name.toLowerCase().includes(activeFilter.toLowerCase())
      );

    return matchesSearch && matchesFilter;
  });

  // Get unique categories from blogs for filters
  const availableCategories = [
    ...new Set(
      blogs.flatMap((blog) => blog.categories?.map((cat) => cat.name) || [])
    ),
  ];

  const allFilters = [
    "All",
    ...availableCategories,
    ...filters.filter((f) => f !== "All"),
  ];
  const uniqueFilters = [...new Set(allFilters)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-10 max-h-32 overflow-y-auto">
            {uniqueFilters.slice(0, 10).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
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

      {/* Featured Articles */}
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
            <span className="text-sm">{blogs.length} articles published</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
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
              onClick={() => dispatch(fetchAllBlogs())}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
