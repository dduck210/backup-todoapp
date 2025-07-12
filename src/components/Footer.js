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
              Todo App
            </Link>
          </span>
          <span className="hidden sm:inline-block text-xs bg-white/30 dark:bg-gray-700/50 rounded px-2 py-1 ml-2 transition">
            © 2025 To Do App™. All Rights Reserved.
          </span>
        </div>
        <nav className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center w-full sm:w-auto text-sm">
          {/* <Link
            to="/"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            Home
          </Link> */}
          <a
            href="https://facebook.com/dduck.210"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            Facebook
          </a>
          <a
            href="https://github.com/dduck210/duc-todolist"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            Github
          </a>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            Tailwind CSS
          </a>
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            React
          </a>
        </nav>
        <span className="block sm:hidden mt-1 text-xs bg-white/30 dark:bg-gray-700/50 rounded px-2 py-1 text-center transition w-full">
          © 2025 To Do App™. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
