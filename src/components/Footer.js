import { Link } from "react-router-dom";
import useDarkMode from "./hooks/useDarkMode";

const Footer = () => {
  useDarkMode();

  return (
    <footer className="bg-blue-600 dark:bg-gray-900 text-white p-4 shadow mt-0 transition">
      <div className="container mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="text-xl font-bold">
            <Link
              to="/"
              className="hover:text-blue-200 dark:hover:text-gray-300 transition"
            >
              Todo App
            </Link>
          </span>
          <span className="text-xs bg-white/30 dark:bg-gray-700/50 rounded px-2 py-1 ml-2 transition">
            © 2025 To Do App™. All Rights Reserved.
          </span>
        </div>
        <nav className="flex flex-wrap gap-3 items-center">
          <Link
            to="/"
            className="hover:underline hover:text-blue-200 dark:hover:text-gray-300 transition"
          >
            Home
          </Link>
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
      </div>
    </footer>
  );
};
export default Footer;
