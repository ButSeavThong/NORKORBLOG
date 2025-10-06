import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * fetchBookmarkedBlogs - Get all bookmarked blogs for current user
 */
export const fetchBookmarkedBlogs = createAsyncThunk(
  "blog/fetchBookmarkedBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to view bookmarked blogs");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/users/bookmarked-blogs`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);
      console.log("Bookmarked blogs response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch bookmarked blogs";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data.blogs || data || [];
    } catch (err) {
      console.error("Fetch bookmarked blogs error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * fetchBlogsByCategory - Get blogs by specific category ID
 */
export const fetchBlogsByCategory = createAsyncThunk(
  "blog/fetchBlogsByCategory",
  async ({ categoryId, page = 1, page_size = 12, sort_by = "created_at", search = "" } = {}, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      // Build query parameters
      let url = `${baseUrl}/blogs?category_id=${categoryId}&page=${page}&page_size=${page_size}&sort_by=${sort_by}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      console.log("Fetching blogs by category:", { 
        categoryId, 
        page, 
        page_size, 
        search,
        url 
      });
      
      const res = await fetch(url);
      const data = await res.json().catch(() => null);
      
      console.log("Blogs by category response:", { 
        status: res.status, 
        categoryId,
        count: data?.blogs?.length,
        total: data?.total 
      });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch blogs by category";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return {
        blogs: data.blogs || data || [],
        currentPage: page,
        totalPages: data.total_pages || Math.ceil((data.total || 0) / page_size),
        totalBlogs: data.total || data.blogs?.length || 0,
        hasMore: data.has_more || (data.blogs && data.blogs.length === page_size),
        categoryId // Include categoryId in response for state tracking
      };
    } catch (err) {
      console.error("Fetch blogs by category error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * likeBlog - Like/Unlike a blog post
 */
export const likeBlog = createAsyncThunk(
  "blog/likeBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to like blog");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/blogs/${blogId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);
      console.log("Like blog response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to like blog";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return { blogId, likes: data.likes || data.number_of_likes || 0, isLiked: data.is_liked };
    } catch (err) {
      console.error("Like blog error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * bookmarkBlog - Bookmark/Unbookmark a blog post
 */
export const bookmarkBlog = createAsyncThunk(
  "blog/bookmarkBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to bookmark blog");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/blogs/${blogId}/bookmark`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);
      console.log("Bookmark blog response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to bookmark blog";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return { blogId, bookmarks: data.bookmarks || data.number_of_bookmarks || 0, isBookmarked: data.is_bookmarked };
    } catch (err) {
      console.error("Bookmark blog error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * updateBlog - Update existing blog post
 */
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ blogId, blogData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to update blog");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      console.log("🔄 Updating blog:", { blogId, blogData });
      
      const res = await fetch(`${baseUrl}/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(blogData),
      });

      const data = await res.json().catch(() => null);
      console.log("📝 Update blog response:", { 
        status: res.status, 
        statusText: res.statusText,
        data 
      });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to update blog";
        console.error("❌ Update blog failed:", message);
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      console.log("✅ Blog updated successfully:", data);
      return data;
    } catch (err) {
      console.error("❌ Update blog error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);
/**
 * deleteBlog - Delete blog post
 */
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to delete blog");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);
      console.log("Delete blog response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to delete blog";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return blogId;
    } catch (err) {
      console.error("Delete blog error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * fetchCategories - Get all categories
 */
export const fetchCategories = createAsyncThunk(
  "blog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/categories`);

      const data = await res.json().catch(() => null);
      console.log("Categories response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch categories";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Fetch categories error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * createBlog - Create new blog post
 */
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to create blog");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(blogData),
      });

      const data = await res.json().catch(() => null);
      console.log("Create blog response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to create blog";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Create blog error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * uploadBlogImage - Upload thumbnail image for blog
 */
export const uploadBlogImage = createAsyncThunk(
  "blog/uploadBlogImage",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to upload image");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";

      const formData = new FormData();
      formData.append("files", file); // ✅ Correct field name

      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => null);
      console.log("Upload blog image response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to upload image";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      // ✅ Handle the response structure: data.files[0].url
      const imageUrl = data?.files?.[0]?.url;
      
      if (!imageUrl) {
        console.error("No image URL in response:", data);
        return rejectWithValue("No image URL received from server");
      }

      return imageUrl;
    } catch (err) {
      console.error("Upload blog image error:", err);
      return rejectWithValue(err.message || "Upload failed");
    }
  }
);

// In blogSlice.js - update the fetchAllBlogs function and state
export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAllBlogs",
  async ({ page = 1, page_size = 12, sort_by = "created_at", search = "", category = "" } = {}, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      // Build query parameters
      let url = `${baseUrl}/blogs?page=${page}&page_size=${page_size}&sort_by=${sort_by}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      console.log("Fetching blogs from:", url);
      
      const res = await fetch(url);
      const data = await res.json().catch(() => null);
      
      console.log("Blogs response:", { 
        status: res.status, 
        page, 
        page_size, 
        search,
        category,
        count: data?.blogs?.length,
        total: data?.total 
      });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch blogs";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return {
        blogs: data.blogs || data || [],
        currentPage: page,
        totalPages: data.total_pages || Math.ceil((data.total || 0) / page_size),
        totalBlogs: data.total || data.blogs?.length || 0,
        hasMore: data.has_more || (data.blogs && data.blogs.length === page_size)
      };
    } catch (err) {
      console.error("Fetch blogs error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * fetchBlogById - Get single blog by ID
 */
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (blogId, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/blogs/${blogId}`);

      const data = await res.json().catch(() => null);
      console.log("Blog detail response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch blog";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Fetch blog error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
    // Pagination state
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasMore: true,
    // Search and filter state
    searchQuery: "",
    selectedCategory: "",
    // Other states...
    categories: [],
    creating: false,
    uploadLoading: false,
    createSuccess: false,
    // NEW STATES
    updating: false,
    updateSuccess: false,
    deleting: false,
    likeLoading: false,
    bookmarkLoading: false,
    // Track which blog is being liked/bookmarked
    likingBlogId: null,
    bookmarkingBlogId: null,
    // NEW: Category-specific blogs state
    categoryBlogs: [], // Blogs for specific category
    categoryBlogsLoading: false,
    categoryBlogsError: null,
    currentCategoryId: null, // Currently viewed category ID

    // NEW: Bookmarked blogs state
    bookmarkedBlogs: [],
    bookmarkedBlogsLoading: false,
    bookmarkedBlogsError: null,

  },
  reducers: {
    clearError(state) {
      state.error = null;
      state.categoryBlogsError = null;
    },
    clearCurrentBlog(state) {
      state.currentBlog = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    clearFilters(state) {
      state.searchQuery = "";
      state.selectedCategory = "";
      state.currentPage = 1;
    },
    clearCreateSuccess(state) {
      state.createSuccess = false;
    },
    clearCategories(state) {
      state.categories = [];
    },
    // NEW REDUCERS
    clearUpdateSuccess(state) {
      state.updateSuccess = false;
    },
    // Clear category blogs
    clearCategoryBlogs(state) {
      state.categoryBlogs = [];
      state.currentCategoryId = null;
      state.categoryBlogsError = null;
    },
    // Optimistically update like state
    optimisticLike(state, action) {
      const { blogId } = action.payload;
      const blog = state.blogs.find(blog => blog.id === blogId);
      if (blog) {
        const currentLikes = blog.number_of_likes || 0;
        const isCurrentlyLiked = blog.is_liked || false;
        
        blog.is_liked = !isCurrentlyLiked;
        blog.number_of_likes = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
      }
      if (state.currentBlog && state.currentBlog.id === blogId) {
        const currentLikes = state.currentBlog.number_of_likes || 0;
        const isCurrentlyLiked = state.currentBlog.is_liked || false;
        
        state.currentBlog.is_liked = !isCurrentlyLiked;
        state.currentBlog.number_of_likes = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
      }
      // Also update in categoryBlogs
      const categoryBlog = state.categoryBlogs.find(blog => blog.id === blogId);
      if (categoryBlog) {
        const currentLikes = categoryBlog.number_of_likes || 0;
        const isCurrentlyLiked = categoryBlog.is_liked || false;
        
        categoryBlog.is_liked = !isCurrentlyLiked;
        categoryBlog.number_of_likes = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
      }
    },
    // Optimistically update bookmark state
    optimisticBookmark(state, action) {
      const { blogId } = action.payload;
      const blog = state.blogs.find(blog => blog.id === blogId);
      if (blog) {
        const currentBookmarks = blog.number_of_bookmarks || 0;
        const isCurrentlyBookmarked = blog.is_bookmarked || false;
        
        blog.is_bookmarked = !isCurrentlyBookmarked;
        blog.number_of_bookmarks = isCurrentlyBookmarked ? currentBookmarks - 1 : currentBookmarks + 1;
      }
      if (state.currentBlog && state.currentBlog.id === blogId) {
        const currentBookmarks = state.currentBlog.number_of_bookmarks || 0;
        const isCurrentlyBookmarked = state.currentBlog.is_bookmarked || false;
        
        state.currentBlog.is_bookmarked = !isCurrentlyBookmarked;
        state.currentBlog.number_of_bookmarks = isCurrentlyBookmarked ? currentBookmarks - 1 : currentBookmarks + 1;
      }
      // Also update in categoryBlogs
      const categoryBlog = state.categoryBlogs.find(blog => blog.id === blogId);
      if (categoryBlog) {
        const currentBookmarks = categoryBlog.number_of_bookmarks || 0;
        const isCurrentlyBookmarked = categoryBlog.is_bookmarked || false;
        
        categoryBlog.is_bookmarked = !isCurrentlyBookmarked;
        categoryBlog.number_of_bookmarks = isCurrentlyBookmarked ? currentBookmarks - 1 : currentBookmarks + 1;
      }
    },
    // NEW: Clear bookmarked blogs
    clearBookmarkedBlogs(state) {
      state.bookmarkedBlogs = [];
      state.bookmarkedBlogsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL BLOGS
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalBlogs = action.payload.totalBlogs;
        state.hasMore = action.payload.hasMore;
        state.error = null;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load blogs";
      })
      
      // FETCH BLOG BY ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load blog";
      })

      // FETCH CATEGORIES
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.categories || action.payload || [];
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load categories";
      })
      
      // CREATE BLOG
      .addCase(createBlog.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.creating = false;
        state.createSuccess = true;
        state.error = null;
        // Store the created blog ID for redirect
        state.currentBlog = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || action.error?.message || "Failed to create blog";
        state.createSuccess = false;
      })
      
      // UPLOAD BLOG IMAGE
      .addCase(uploadBlogImage.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadBlogImage.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.error = null;
      })
      .addCase(uploadBlogImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload || action.error?.message || "Failed to upload image";
      })

       // LIKE BLOG
      .addCase(likeBlog.pending, (state, action) => {
        state.likeLoading = true;
        state.likingBlogId = action.meta.arg;
        state.error = null;
        
        // Store original values for potential revert
        const blogId = action.meta.arg;
        const blog = state.blogs.find(blog => blog.id === blogId);
        if (blog) {
          action.meta.originalValues = {
            likes: blog.number_of_likes || 0,
            isLiked: blog.is_liked || false
          };
        }
        if (state.currentBlog && state.currentBlog.id === blogId) {
          action.meta.originalValues = {
            likes: state.currentBlog.number_of_likes || 0,
            isLiked: state.currentBlog.is_liked || false
          };
        }
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.likeLoading = false;
        state.likingBlogId = null;
        const { blogId, likes, isLiked } = action.payload;
        
        // Update blogs list
        const blog = state.blogs.find(blog => blog.id === blogId);
        if (blog) {
          blog.is_liked = isLiked;
          blog.number_of_likes = likes;
        }
        
        // Update current blog if it's the one being liked
        if (state.currentBlog && state.currentBlog.id === blogId) {
          state.currentBlog.is_liked = isLiked;
          state.currentBlog.number_of_likes = likes;
        }
        
        state.error = null;
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.likeLoading = false;
        state.likingBlogId = null;
        
        // Revert optimistic update
        if (action.meta.originalValues) {
          const { likes, isLiked } = action.meta.originalValues;
          const blogId = action.meta.arg;
          
          const blog = state.blogs.find(blog => blog.id === blogId);
          if (blog) {
            blog.is_liked = isLiked;
            blog.number_of_likes = likes;
          }
          if (state.currentBlog && state.currentBlog.id === blogId) {
            state.currentBlog.is_liked = isLiked;
            state.currentBlog.number_of_likes = likes;
          }
        }
        
        state.error = action.payload || action.error?.message || "Failed to like blog";
      })
      
      // BOOKMARK BLOG
      .addCase(bookmarkBlog.pending, (state, action) => {
        state.bookmarkLoading = true;
        state.bookmarkingBlogId = action.meta.arg;
        state.error = null;
        
        // Store original values for potential revert
        const blogId = action.meta.arg;
        const blog = state.blogs.find(blog => blog.id === blogId);
        if (blog) {
          action.meta.originalValues = {
            bookmarks: blog.number_of_bookmarks || 0,
            isBookmarked: blog.is_bookmarked || false
          };
        }
        if (state.currentBlog && state.currentBlog.id === blogId) {
          action.meta.originalValues = {
            bookmarks: state.currentBlog.number_of_bookmarks || 0,
            isBookmarked: state.currentBlog.is_bookmarked || false
          };
        }
      })
      .addCase(bookmarkBlog.fulfilled, (state, action) => {
        state.bookmarkLoading = false;
        state.bookmarkingBlogId = null;
        const { blogId, bookmarks, isBookmarked } = action.payload;
        
        // Update blogs list
        const blog = state.blogs.find(blog => blog.id === blogId);
        if (blog) {
          blog.is_bookmarked = isBookmarked;
          blog.number_of_bookmarks = bookmarks;
        }
        
        // Update current blog if it's the one being bookmarked
        if (state.currentBlog && state.currentBlog.id === blogId) {
          state.currentBlog.is_bookmarked = isBookmarked;
          state.currentBlog.number_of_bookmarks = bookmarks;
        }
        
        state.error = null;
      })
      .addCase(bookmarkBlog.rejected, (state, action) => {
        state.bookmarkLoading = false;
        state.bookmarkingBlogId = null;
        
        // Revert optimistic update
        if (action.meta.originalValues) {
          const { bookmarks, isBookmarked } = action.meta.originalValues;
          const blogId = action.meta.arg;
          
          const blog = state.blogs.find(blog => blog.id === blogId);
          if (blog) {
            blog.is_bookmarked = isBookmarked;
            blog.number_of_bookmarks = bookmarks;
          }
          if (state.currentBlog && state.currentBlog.id === blogId) {
            state.currentBlog.is_bookmarked = isBookmarked;
            state.currentBlog.number_of_bookmarks = bookmarks;
          }
        }
        
        state.error = action.payload || action.error?.message || "Failed to bookmark blog";
      })
      
      // UPDATE BLOG
      .addCase(updateBlog.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.error = null;
        
        // Update current blog
        state.currentBlog = action.payload;
        
        // Update in blogs list if exists
        const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || action.error?.message || "Failed to update blog";
        state.updateSuccess = false;
      })
      
      // DELETE BLOG
      .addCase(deleteBlog.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        
        // Remove from blogs list
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        
        // Clear current blog if it's the deleted one
        if (state.currentBlog && state.currentBlog.id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error?.message || "Failed to delete blog";
      })

      // FETCH BLOGS BY CATEGORY
      .addCase(fetchBlogsByCategory.pending, (state) => {
        state.categoryBlogsLoading = true;
        state.categoryBlogsError = null;
      })
      .addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
        state.categoryBlogsLoading = false;
        state.categoryBlogs = action.payload.blogs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalBlogs = action.payload.totalBlogs;
        state.hasMore = action.payload.hasMore;
        state.currentCategoryId = action.payload.categoryId;
        state.categoryBlogsError = null;
      })
      .addCase(fetchBlogsByCategory.rejected, (state, action) => {
        state.categoryBlogsLoading = false;
        state.categoryBlogsError = action.payload || action.error?.message || "Failed to load category blogs";
      })
      // FETCH BOOKMARKED BLOGS
      .addCase(fetchBookmarkedBlogs.pending, (state) => {
        state.bookmarkedBlogsLoading = true;
        state.bookmarkedBlogsError = null;
      })
      .addCase(fetchBookmarkedBlogs.fulfilled, (state, action) => {
        state.bookmarkedBlogsLoading = false;
        state.bookmarkedBlogs = action.payload;
        state.bookmarkedBlogsError = null;
      })
      .addCase(fetchBookmarkedBlogs.rejected, (state, action) => {
        state.bookmarkedBlogsLoading = false;
        state.bookmarkedBlogsError = action.payload || action.error?.message || "Failed to load bookmarked blogs";
      });
  },
});

// Export the new action
export const { 
  clearError, 
  clearCurrentBlog,
  setCurrentPage,
  setSearchQuery,        
  setSelectedCategory,  
  clearFilters,          
  clearCreateSuccess,
  clearCategories,
  clearUpdateSuccess,
  clearCategoryBlogs,
  clearBookmarkedBlogs, // Add this
  optimisticLike,
  optimisticBookmark,
} = blogSlice.actions;

export default blogSlice.reducer;