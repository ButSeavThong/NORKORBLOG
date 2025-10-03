import { NavLink, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, logout } from "../../features/auth/authSlice";
import { useEffect, useState } from "react"; // Add useState import

export default function NavbarComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // get auth state
  const { user, token } = useSelector((state) => state.auth);

  // fetch profile when token exists but user not yet loaded
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menu = [
    { path: "/", name: "Home", dropdown: false },
    { path: "/about", name: "About", dropdown: false },
    { path: "/education", name: "Education", dropdown: false },
    { path: "/technology", name: "Technology", dropdown: false },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md z-50 transition-all duration-300">
      <div className="px-12 md:px-[150px] mx-auto py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center" onClick={closeMobileMenu}>
          <img src="/logo.jpeg" alt="Logo" className="h-15 w-auto" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-[16px] font-medium">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${
                  item.dropdown ? "flex items-center space-x-1" : ""
                } ${
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

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Write button for logged in users */}
          {token && (
            <Link
              to="/create-blog"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Write
            </Link>
          )}

          {/* Show signup/login if not logged in */}
          {!token ? (
            <NavLink
              to="/register"
              className="bg-[#2563EB] text-white text-[16px] px-5 py-2 rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
            >
              Sign Up
            </NavLink>
          ) : (
            // Show profile dropdown if logged in
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <img
                  src={user?.profile?.profileUrl || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border object-cover"
                />
                <span className="text-gray-700 dark:text-gray-200">
                  {user?.profile?.username || "Profile"}
                </span>
                <FontAwesomeIcon icon={faCaretDown} />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/create-blog"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Write Story
                </NavLink>
                <NavLink
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white focus:outline-none transition-colors duration-300"
          onClick={toggleMobileMenu}
        >
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
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-2">
          {/* Navigation Links */}
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Mobile Auth Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            {!token ? (
              <div className="space-y-2">
                <NavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg font-medium transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 bg-[#2563EB] text-white rounded-lg text-lg font-medium text-center hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Write Button for Mobile */}
                <Link
                  to="/create-blog"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Write Story
                </Link>

                {/* Profile Links */}
                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <img
                    src={user?.profile?.profileUrl || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full border object-cover"
                  />
                  <span>Profile</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Settings
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
