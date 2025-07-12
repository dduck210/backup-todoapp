import { Link } from "react-router-dom";
import useDarkMode from "./hooks/useDarkMode";

const Footer = () => {
  useDarkMode();

  return (
    <footer className="fixed left-0 bottom-0 w-full z-50 bg-blue-600 dark:bg-gray-900 text-white shadow mt-0 transition min-h-[52px] flex items-center">
      <div className="container mx-auto flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between min-h-[60px]">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <span className="text-2xl font-bold whitespace-nowrap">
            <Link
              to="/"
              className="hover:text-blue-200 dark:hover:text-gray-300 transition"
            >
              투두 앱
            </Link>
          </span>
          <span className="hidden sm:inline-block text-xs bg-white/30 dark:bg-gray-700/50 rounded px-2 py-1 ml-2 transition">
            © 2025 투두 앱™. 모든 권리 보유.
          </span>
        </div>
        <nav className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center w-full sm:w-auto text-sm">
          {/* 홈 메뉴 필요시 추가
          <Link
            to="/"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            홈
          </Link> 
          */}
          <a
            href="https://www.facebook.com/OmiGroup.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            페이스북
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            깃허브
          </a>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            테일윈드 CSS
          </a>
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            리액트
          </a>
        </nav>
        <span className="block sm:hidden mt-1 text-xs bg-white/30 dark:bg-gray-700/50 rounded px-2 py-1 text-center transition w-full">
          © 2025 투두 앱™. 모든 권리 보유.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
