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

  // Cập nhật user khi đổi route
  useEffect(() => {
    setMenuOpen(false);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);

    try {
      setUsername(storedUser ? JSON.parse(storedUser).username : "");
    } catch {
      setUsername(storedUser || "");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("성공적으로 로그아웃되었습니다!");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-600 dark:bg-gray-900 text-white p-4 shadow transition">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link
            to="/"
            className="hover:text-blue-200 dark:hover:text-gray-300 transition"
            onClick={closeMenu}
          >
            투두 앱
          </Link>
        </h1>

        {/* Hamburger */}
        <button
          className="sm:hidden flex flex-col justify-center items-center ml-auto"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="메뉴 열기"
        >
          <span
            aria-hidden="true"
            className="block w-7 h-1 bg-white rounded my-[3px]"
          ></span>
          <span
            aria-hidden="true"
            className="block w-7 h-1 bg-white rounded my-[3px]"
          ></span>
          <span
            aria-hidden="true"
            className="block w-7 h-1 bg-white rounded my-[3px]"
          ></span>
        </button>

        {/* Navigation */}
        <nav
          className={`flex-col sm:flex-row sm:flex gap-3 items-center flex-wrap
            bg-blue-600 dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent
            absolute sm:static top-full left-0 right-0 w-full sm:w-auto transition-all duration-200 z-40
            ${menuOpen ? "flex" : "hidden sm:flex"}`}
        >
          {/* Dark/Light Toggle */}
          <button
            className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 dark:bg-gray-700 dark:hover:bg-gray-600 transition w-full sm:w-auto"
            onClick={() => {
              setDarkMode((v) => !v);
              closeMenu();
            }}
            title="다크 모드 전환"
          >
            {darkMode ? "🌙 다크" : "☀️ 라이트"}
          </button>

          {/* Menu items */}
          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className="hover:underline block px-4 py-2 sm:p-0"
                onClick={closeMenu}
              >
                홈
              </Link>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
                <span className="font-semibold text-white block px-4 py-2 sm:p-0">
                  안녕하세요, {username}님!
                </span>
                <button
                  className="px-3 py-1 bg-gray-50 text-blue-700 rounded hover:bg-blue-200 transition w-full sm:w-auto"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:underline block px-4 py-2 sm:p-0"
                onClick={closeMenu}
              >
                로그인
              </Link>
              <Link
                to="/register"
                className="hover:underline block px-4 py-2 sm:p-0"
                onClick={closeMenu}
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
