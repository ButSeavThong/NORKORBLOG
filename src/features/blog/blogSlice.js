import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
  },
  reducers: {
    clearError(state) {
      state.error = null;
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
      });
  },
});

// ✅ FIXED: Export ALL actions including the new ones
export const { 
  clearError, 
  clearCurrentBlog,
  setCurrentPage,
  setSearchQuery,        // ✅ Added this export
  setSelectedCategory,   // ✅ Added this export  
  clearFilters,          // ✅ Added this export
  clearCreateSuccess,
  clearCategories 
} = blogSlice.actions;

export default blogSlice.reducer;