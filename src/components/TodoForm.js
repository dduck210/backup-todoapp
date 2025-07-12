import { useState } from "react";
import { toast } from "react-toastify";

const TodoForm = ({ onAdd, users = [], isAdmin, currentUserId }) => {
  const [text, setText] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text) {
      toast.info("작업을 입력하세요!");
      return;
    }
    if (isAdmin && !assignedUser) {
      toast.info("할당할 사용자를 선택하세요!");
      return;
    }
    onAdd(text, isAdmin ? assignedUser : currentUserId);
    setText("");
    setAssignedUser("");
  };

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 mb-0 w-full"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-blue-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-gray-400 outline-none rounded-lg px-4 py-2 h-12 text-base shadow-sm transition-all duration-150 placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:w-52 md:w-64 lg:w-80"
        placeholder="새로운 작업 입력..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={10000}
      />
      {isAdmin && (
        <div className="relative w-full sm:w-40 md:w-48 lg:w-56">
          <select
            className="h-12 px-4 pr-10 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:border-blue-500 dark:focus:border-gray-400 transition-all w-full appearance-none"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option value="">할당 사용자 선택...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
              className="text-gray-700 dark:text-gray-200"
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
      )}
      <button
        className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold shadow transition-all duration-150 w-full sm:w-auto whitespace-nowrap"
        type="submit"
      >
        작업 추가
      </button>
    </form>
  );
};

export default TodoForm;
