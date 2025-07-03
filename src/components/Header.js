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

  useEffect(() => {
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
    <header className="bg-blue-600 dark:bg-gray-900 text-white p-4 shadow transition">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">Todo App</Link>
        </h1>
        <nav className="flex gap-3 items-center flex-wrap">
          <button
            className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            onClick={() => setDarkMode((v) => !v)}
            title="Toggle dark mode"
          >
            {darkMode ? "Dark" : "Light"}
          </button>
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {!isLoggedIn && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                Hello, {username}!
              </span>
              <button
                className="px-3 py-1 bg-gray-50 text-blue-700 rounded hover:bg-blue-200 transition"
                onClick={handleLogout}
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
