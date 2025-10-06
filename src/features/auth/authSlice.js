import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * fetchUserById - Get user by ID
 */
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/users/${userId}`);

      const data = await res.json().catch(() => null);
      console.log("User by ID response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch user";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Fetch user error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * fetchUserBlogs - Get blogs by user ID
 */
export const fetchUserBlogs = createAsyncThunk(
  "auth/fetchUserBlogs",
  async (userId, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/blogs?author_id=${userId}`);

      const data = await res.json().catch(() => null);
      console.log("User blogs response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to fetch user blogs";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Fetch user blogs error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * updateUserProfile - Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Please login to update profile");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const res = await fetch(`${baseUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json().catch(() => null);
      console.log("Update profile response:", { status: res.status, data });

      if (!res.ok) {
        const message = data?.message || data?.error || "Failed to update profile";
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Update profile error:", err);
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * uploadImage
 * - Uploads a single file to backend `/upload`
 * - Backend expects field name: "files"
 */
export const uploadImage = createAsyncThunk(
  "auth/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return rejectWithValue(data?.message || "Upload failed");
      }

      // ✅ return the uploaded file URL
      return data?.files?.[0]?.url;
    } catch (err) {
      return rejectWithValue(err.message || "Upload failed");
    }
  }
);

/**
 * registerUser
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      console.log("Register API URL:", `${baseUrl}/register`);

      let body;
      let headers = {};

      if (formData instanceof FormData) {
        body = formData;
      } else {
        body = JSON.stringify(formData);
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message || data?.error || data?.errors || (typeof data === "string" ? data : "Registration failed");
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * loginUser
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";

      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message || data?.error || (typeof data === "string" ? data : null);
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

/**
 * fetchProfile
 */
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";

      const res = await fetch(`${baseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message || data?.error || (typeof data === "string" ? data : null);
        return rejectWithValue(message || `HTTP ${res.status}`);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    success: false,
    
    // NEW STATES FOR PROFILE AND BLOG MANAGEMENT
    authorProfile: null,        // For viewing other users' profiles
    authorBlogs: [],           // Blogs for the author being viewed
    authorLoading: false,      // Loading state for author data
    profileLoading: false,     // Loading state for profile updates
    uploadLoading: false,      // Loading state for image uploads
    updateSuccess: false,      // Success state for profile updates
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    clearUpdateSuccess(state) {
      state.updateSuccess = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
      state.authorProfile = null;
      state.authorBlogs = [];
      localStorage.removeItem("token");
    },
    clearAuthorProfile(state) {
      state.authorProfile = null;
      state.authorBlogs = [];
    },
    clearAuthorBlogs(state) {
      state.authorBlogs = [];
    },
    // Optimistically update user blogs after delete
    removeUserBlog(state, action) {
      state.authorBlogs = state.authorBlogs.filter(blog => blog.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER USER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Register failed";
        state.success = false;
      })
      
      // LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.access_token || localStorage.getItem("token");
        state.user = null; // We'll fetch profile separately
        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Login failed";
        state.success = false;
      })
      
      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load profile";
        // Clear token if profile fetch fails (token might be invalid)
        if (action.payload?.includes("token") || action.payload?.includes("auth")) {
          state.token = null;
          localStorage.removeItem("token");
        }
      })
      
      // FETCH USER BY ID (for author profiles)
      .addCase(fetchUserById.pending, (state) => {
        state.authorLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.authorLoading = false;
        state.authorProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.authorLoading = false;
        state.error = action.payload || action.error?.message || "Failed to load user profile";
      })
      
      // FETCH USER BLOGS
      .addCase(fetchUserBlogs.pending, (state) => {
        state.authorLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.authorLoading = false;
        state.authorBlogs = action.payload?.blogs || action.payload || [];
        state.error = null;
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.authorLoading = false;
        state.error = action.payload || action.error?.message || "Failed to load user blogs";
      })
      
      // UPDATE USER PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload || action.error?.message || "Failed to update profile";
        state.updateSuccess = false;
      })
      
      // UPLOAD IMAGE
      .addCase(uploadImage.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.error = null;
        // Note: The URL is returned but not automatically set to user profile
        // You need to call updateUserProfile with the new image URL
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload || action.error?.message || "Failed to upload image";
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearUpdateSuccess,
  logout, 
  clearAuthorProfile, 
  clearAuthorBlogs,
  removeUserBlog 
} = authSlice.actions;

export default authSlice.reducer;