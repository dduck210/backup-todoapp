const SearchUser = ({ users, value, onChange }) => {
  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <label
        className="font-semibold text-base text-gray-800 dark:text-gray-100 whitespace-nowrap"
        htmlFor="user-select"
      >
        Filter by user:
      </label>
      <select
        id="user-select"
        className="
          h-12
          pl-2 pr-4
          rounded-lg
          border border-blue-300 dark:border-gray-500
          bg-white dark:bg-gray-800
          text-base
          text-gray-900 dark:text-gray-100
          w-full sm:w-50
          focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-700
          transition
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
    </div>
  );
};

export default SearchUser;
