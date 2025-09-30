"use client";

import { useState } from "react";
import { Search, TrendingUp, Users } from "lucide-react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Technology",
    "React",
    "Design",
    "JavaScript",
    "CSS",
    "Career",
  ];

  const featuredArticles = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      category: "Technology",
      image: "/coding-screen-with-react-code.jpg",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Modern CSS Grid Layouts",
      category: "React",
      image: "/react-development-interface.jpg",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      category: "Design",
      image: "/design-wireframes-and-mockups.jpg",
      readTime: "6 min read",
    },
  ];

  const filteredArticles =
    activeFilter === "All"
      ? featuredArticles
      : featuredArticles.filter(
          (article) =>
            article.category === activeFilter ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const searchFilteredArticles = searchQuery
    ? filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredArticles;

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
          <div className="flex flex-wrap gap-3 mb-10">
            {filters.map((filter) => (
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
            <span className="text-sm">1.2k readers this week</span>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchFilteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className="relative">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      article.category === "Technology"
                        ? "bg-teal-600"
                        : article.category === "React"
                        ? "bg-blue-600"
                        : "bg-purple-600"
                    }`}
                  >
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm">{article.readTime}</p>
              </div>
            </div>
          ))}
        </div>

        {searchFilteredArticles.length === 0 && (
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
