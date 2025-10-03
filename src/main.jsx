import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomePage from "./pages/home/HomePage.jsx";
import "./index.css";
import App from "./App.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import EducationPage from "./pages/education/EducationPage.jsx";
import TechnologyPage from "./pages/technology/TechnologyPage.jsx";
import RootLayout from "./components/layouts/root-layout.jsx";
import { NotFoundPage } from "./pages/not-found/NotFound.jsx";
import RegisterForm from "./pages/register/RegisterForm.jsx";
import LoginPage from "./pages/login/LoginForm.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import BlogDetail from "./components/blog/BlogDetail.jsx";
import AuthorProfile from "./pages/auth/AuthorProfile.jsx";
import CreateBlog from "./components/blog/CreateBlog.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/author/:userId" element={<AuthorProfile />} />{" "}
            {/* Add this route */}
            <Route
              path="/create-blog"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
