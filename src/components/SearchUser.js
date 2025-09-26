const SearchUser = ({ users, value, onChange }) => {
  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <label
        className="font-semibold text-base text-gray-800 dark:text-gray-100 whitespace-nowrap"
        htmlFor="user-select"
      >
        Filter by user:
      </label>
      <div className="relative w-full">
        <select
          id="user-select"
          className="
            h-12
            pl-4 pr-10 py-2 rounded-lg
            border border-blue-300 dark:border-gray-500
            bg-white dark:bg-gray-800
            text-base
            text-gray-900 dark:text-gray-100
            w-full sm:w-50
            focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-700
            transition
            appearance-none
          "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">All users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            className="text-gray-600 dark:text-gray-200"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
