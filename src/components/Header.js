import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useDarkMode from "./hooks/useDarkMode";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [darkMode, setDarkMode] = useDarkMode();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUsername(userObj.username || storedUser);
      } catch {
        setUsername(storedUser);
      }
    } else {
      setUsername("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-600 dark:bg-gray-900 text-white p-4 shadow transition">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold flex-shrink-0">
          <Link
            to="/"
            className="hover:text-blue-200 dark:hover:text-gray-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Todo App
          </Link>
        </h1>
        <button
          className="sm:hidden flex items-center ml-auto"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open Menu"
        >
          <span className="block w-7 h-1 bg-white rounded my-[3px]"></span>
          <span className="block w-7 h-1 bg-white rounded my-[3px]"></span>
          <span className="block w-7 h-1 bg-white rounded my-[3px]"></span>
        </button>
        <nav
          className={`
            flex-col sm:flex-row sm:flex gap-3 items-center flex-wrap
            bg-blue-600 dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent
            absolute sm:static top-full left-0 right-0 sm:w-auto w-full sm:h-auto
            transition-all duration-200 z-50 overflow-hidden
            ${menuOpen ? "flex" : "hidden sm:flex"}
          `}
        >
          <button
            className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition w-full sm:w-auto text-left sm:text-center"
            onClick={() => {
              setDarkMode((v) => !v);
              setMenuOpen(false);
            }}
            title="Toggle dark mode"
          >
            {darkMode ? "Dark" : "Light"}
          </button>
          {isLoggedIn && (
            <Link
              to="/"
              className="hover:underline block px-4 py-2 sm:p-0"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          )}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="hover:underline block px-4 py-2 sm:p-0"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:underline block px-4 py-2 sm:p-0"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
          {isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
              <span className="font-semibold text-white block px-4 py-2 sm:p-0 text-left sm:text-center">
                Hello, {username}!
              </span>
              <button
                className="px-3 py-1 bg-gray-50 text-blue-700 rounded hover:bg-blue-200 transition w-full sm:w-auto"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
