import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blog/blogSlice"; // Add this line

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer, // Add this line
  },
});