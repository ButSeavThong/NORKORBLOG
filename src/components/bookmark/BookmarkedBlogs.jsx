import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bookmark, Search, BookOpen, ArrowLeft, Filter } from "lucide-react";
import {
  fetchBookmarkedBlogs,
  clearBookmarkedBlogs,
} from "../../features/blog/blogSlice";
import BlogCard from "../../components/blog/BlogCard";

const BookmarkedBlogs = () => {
  const dispatch = useDispatch();
  const { bookmarkedBlogs, bookmarkedBlogsLoading, bookmarkedBlogsError } =
    useSelector((state) => state.blog);

  const { token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Load bookmarked blogs
  useEffect(() => {
    if (token) {
      dispatch(fetchBookmarkedBlogs());
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearBookmarkedBlogs());
    };
  }, [dispatch, token]);

  // Filter blogs based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = bookmarkedBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author?.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          blog.categories?.some((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(bookmarkedBlogs);
    }
  }, [bookmarkedBlogs, searchQuery]);

  const handleRetry = () => {
    dispatch(fetchBookmarkedBlogs());
  };

  const displayBlogs = searchQuery ? filteredBlogs : bookmarkedBlogs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-2xl">
                  <Bookmark className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Your Bookmarked Stories
                  </h1>
                  <p className="text-gray-600">
                    All the articles you've saved for later reading
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                <div className="text-2xl font-bold text-purple-700 text-center">
                  {bookmarkedBlogs.length}
                </div>
                <div className="text-sm text-purple-600">Saved Articles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your bookmarked articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Found {filteredBlogs.length} articles matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Loading State */}
        {bookmarkedBlogsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookmarked articles...</p>
          </div>
        )}

        {/* Error State */}
        {bookmarkedBlogsError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8">
            <div className="text-red-600 mb-4">
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Unable to load bookmarks
              </h3>
              <p>{bookmarkedBlogsError}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Bookmarked Blogs Grid */}
        {!bookmarkedBlogsLoading && !bookmarkedBlogsError && (
          <>
            {displayBlogs.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Saved Articles ({displayBlogs.length})
                  </h2>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayBlogs.map((blog) => (
                    <div key={blog.id} className="relative">
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-purple-600 text-white p-2 rounded-full shadow-lg">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
                  <div className="text-gray-400 mb-6">
                    <Bookmark className="w-24 h-24 mx-auto" />
                  </div>

                  {searchQuery ? (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No matching bookmarks found
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        No bookmarked articles match your search for "
                        {searchQuery}". Try different keywords or clear your
                        search.
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No bookmarks yet
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        When you bookmark articles by clicking the bookmark
                        icon, they will appear here for easy access later.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          to="/"
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                        >
                          Explore Articles
                        </Link>
                        <Link
                          to="/education"
                          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-center"
                        >
                          Browse Education
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        {!bookmarkedBlogsLoading && bookmarkedBlogs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reading Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {bookmarkedBlogs.length}
                </div>
                <div className="text-sm text-blue-600">Total Saved</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.ceil(
                    bookmarkedBlogs.reduce(
                      (total, blog) =>
                        total + (blog.content?.split(/\s+/).length || 0),
                      0
                    ) / 200
                  )}
                </div>
                <div className="text-sm text-green-600">
                  Total Reading Time (min)
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    new Set(
                      bookmarkedBlogs.flatMap(
                        (blog) => blog.categories?.map((cat) => cat.name) || []
                      )
                    ).size
                  }
                </div>
                <div className="text-sm text-purple-600">Categories</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    new Set(
                      bookmarkedBlogs.map((blog) => blog.author?.username)
                    ).size
                  }
                </div>
                <div className="text-sm text-orange-600">Different Authors</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkedBlogs;
