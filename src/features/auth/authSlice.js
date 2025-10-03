import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Add this to your existing authSlice.js

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

// In authSlice.js - update the fetchUserBlogs function
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
 * uploadImage
 * - Uploads a single file to backend `/upload`
 * - Backend expects field name: "files"
 */
export const uploadImage = createAsyncThunk(
  "auth/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
      const formData = new FormData();

      // ✅ correct field name is "files"
      formData.append("files", file);

      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
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
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";
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
        const message =
          data?.message ||
          data?.error ||
          data?.errors ||
          (typeof data === "string" ? data : "Registration failed");
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
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";

      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.message ||
          data?.error ||
          (typeof data === "string" ? data : null);
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

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://blog-api.srengchipor.dev";

      const res = await fetch(`${baseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.message ||
          data?.error ||
          (typeof data === "string" ? data : null);
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
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
      localStorage.removeItem("token");
    },
     // Add these new reducers
    clearAuthorProfile(state) {
      state.authorProfile = null;
      state.authorBlogs = [];
    },
    clearAuthorBlogs(state) {
      state.authorBlogs = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error =
          action.payload || action.error?.message || "Register failed";
        state.success = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token =
          action.payload?.access_token || localStorage.getItem("token");
        state.user = null;
        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Login failed";
        state.success = false;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to load profile";
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
    })
    .addCase(fetchUserBlogs.fulfilled, (state, action) => {
      state.authorLoading = false;
      state.authorBlogs = action.payload?.blogs || action.payload || [];
      state.error = null;
    })
    .addCase(fetchUserBlogs.rejected, (state, action) => {
      state.authorLoading = false;
      state.error = action.payload || action.error?.message || "Failed to load user blogs";
    });
  },
});

export const { clearError, clearSuccess, logout, clearAuthorProfile, clearAuthorBlogs } = authSlice.actions;
export default authSlice.reducer;
