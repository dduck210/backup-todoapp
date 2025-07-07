import { useState } from "react";
import { toast } from "react-toastify";

const TodoForm = ({ onAdd, users = [], isAdmin, currentUserId }) => {
  const [text, setText] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text) {
      toast.info("Please enter task!");
      return;
    }
    if (isAdmin && !assignedUser) {
      toast.info("Select user to assign!");
      return;
    }
    onAdd(text, isAdmin ? assignedUser : currentUserId);
    setText("");
    setAssignedUser("");
  };

  console.log("isAdmin", isAdmin, users);

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 mb-0 w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col w-65 sm:w-80">
        <input
          className="border border-blue-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-gray-400 outline-none rounded-lg px-4 py-2 h-12 text-base shadow-sm transition-all duration-150 placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Enter new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={10000}
        />
      </div>
      {isAdmin && (
        <select
          className="
      h-12
      px-4 py-2
      bg-white dark:bg-gray-800
      border border-blue-300 dark:border-gray-600
      rounded-lg
      text-base
      text-gray-900 dark:text-gray-100
      shadow-sm
      focus:outline-none
      focus:border-blue-500 dark:focus:border-gray-400
      transition-all
      w-full sm:w-48 md:w-56 lg:w-64
      mb-6 sm:mb-0
    "
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          <option value="">Assign to...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      )}
      <button
        className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold shadow transition-all duration-150 w-full sm:w-auto"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
};

export default TodoForm;
