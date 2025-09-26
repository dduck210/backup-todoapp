const SearchUsername = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="
        h-12 px-3
        border border-blue-300 dark:border-gray-600
        rounded-lg
        w-full sm:w-100
        focus:outline-none
        focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600
        transition
        text-base
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
      "
      placeholder="Search by username..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchUsername;
