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
      className="w-full flex flex-col sm:flex-row items-center gap-3 mt-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="w-full h-12 px-4 py-2 border border-blue-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
        placeholder="Search tasks..."
        value={keyword}
        onChange={handleChange}
        maxLength={100}
      />
      {/* <button
        type="submit"
        className="h-12 w-[130px] px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition mb-4"
      >
        검색
      </button> */}
    </form>
  );
};

export default SearchTask;
