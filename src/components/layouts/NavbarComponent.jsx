import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export default function NavbarComponent() {
  const menu = [
    { path: "/", name: "Home", dropdown: false },
    { path: "/about", name: "About", dropdown: false },
    { path: "/education", name: "Education", dropdown: true },
    { path: "/technology", name: "Technology", dropdown: true },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md z-50 transition-all duration-300">
      <div className="px-12 md:px-[150px] mx-auto py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src="/image/logo.png" alt="Logo" className="h-15 w-auto" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${item.dropdown ? "flex items-center space-x-1" : ""} ${
                  isActive
                    ? "text-indigo-800 dark:text-white"
                    : "text-gray-700 dark:text-gray-200"
                } hover:text-indigo-800 dark:hover:text-white transition-colors duration-300`
              }
            >
              <span>{item.name}</span>
              {item.dropdown && <FontAwesomeIcon icon={faCaretDown} />}
            </NavLink>
          ))}
        </div>

        {/* Right Side (Search + Sign Up) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Icon */}
          <button className="text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white focus:outline-none transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </button>

          {/* Sign Up Button */}
          <NavLink
            to="/signup"
            className="bg-[#2563EB] text-white text-lg px-5 py-2 rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
          >
            Sign Up
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white focus:outline-none transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

