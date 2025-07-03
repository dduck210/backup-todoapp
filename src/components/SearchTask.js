import { useState } from "react";

const SearchTask = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleChange = (event) => {
    setKeyword(event.target.value);
    onSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword);
  };

  return (
    <form
      className="w-full flex flex-col sm:flex-row items-center gap-3 mb-6"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="px-4 py-2 border border-blue-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition text-base w-60 sm:w-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder="Search task..."
        value={keyword}
        onChange={handleChange}
        maxLength={100}
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchTask;
