import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";
import AboutPage from "./pages/about/AboutPage.jsx";
import EducationPage from "./pages/education/EducationPage.jsx";
import TechnologyPage from "./pages/technology/TechnologyPage.jsx";
import RootLayout from "./components/layouts/root-layout.jsx";
import { NotFoundPage } from "./pages/not-found/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes >
        <Route element={<RootLayout/>}>
          <Route path="/" element={<App/>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/education" element={<EducationPage/>} />
          <Route path="/technology" element={<TechnologyPage/>} />
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/*" element={<NotFoundPage/>} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
