import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "../components/TodoForm";
import SearchTask from "../components/SearchTask";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const API_URL = "https://todo-backend-6c6i.onrender.com/todos";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setTimeout(() => {
          setTodos(res.data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setNotification("Unable to load data, please try again!");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async (text) => {
    try {
      setLoading(true);
      const res = await axios.post(API_URL, {
        todo: text,
        completed: null,
        userId: 1,
      });
      setTodos([res.data, ...todos]);
      toast.success("Added task successfully!");
    } catch {
      setNotification("Error adding task!");
    } finally {
      setLoading(false);
      removeNotification();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Cannot delete task!");
    }
    removeNotification();
  };

  const handleToggle = async (id, completed) => {
    try {
      const found = todos.find((task) => task.id === id);
      const updated = { ...found, completed };
      await axios.put(`${API_URL}/${id}`, updated);
      setTodos(
        todos.map((task) => (task.id === id ? { ...task, completed } : task))
      );
      setNotification("Status updated!");
    } catch {
      setNotification("Update status failed!");
    }
    removeNotification();
  };

  const handleEdit = async (id, text) => {
    if (!text || text.trim() === "") {
      toast.error("Please enter task!");
      return;
    }
    try {
      const found = todos.find((task) => task.id === id);
      const updated = { ...found, todo: text };
      await axios.put(`${API_URL}/${id}`, updated);
      setTodos(
        todos.map((task) => (task.id === id ? { ...task, todo: text } : task))
      );
      toast.success("Fixed task!");
    } catch {
      toast.error("Error when editing task!");
    }
  };

  const removeNotification = () => setTimeout(() => setNotification(""), 1200);

  // Lọc filter và search
  const filteredTodos = todos.filter((todo) => {
    const matchFilter =
      (filter === "completed" && todo.completed === true) ||
      (filter === "uncompleted" && todo.completed === false) ||
      (filter === "notprocessed" &&
        (todo.completed === null || todo.completed === undefined)) ||
      filter === "all";
    const matchSearch = todo.todo
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <span className="text-blue-600 font-semibold text-lg mb-4">
          Loading...
        </span>
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen flex justify-center bg-gray-50 dark:bg-gray-800 rounded-xl transition">
      <div className="w-full flex-1 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 mt-0 py-5 transition">
        <div className="mb-0">
          <SearchTask onSearch={setSearch} />
        </div>
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            className={`px-5 py-2 rounded-lg transition font-medium
              ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-600"
              }
            `}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-5 py-2 rounded-lg transition font-medium
              ${
                filter === "completed"
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-gray-600"
              }
            `}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`px-5 py-2 rounded-lg transition font-medium
              ${
                filter === "uncompleted"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-600"
              }
            `}
            onClick={() => setFilter("uncompleted")}
          >
            Uncompleted
          </button>
          <button
            className={`px-5 py-2 rounded-lg transition font-medium
              ${
                filter === "notprocessed"
                  ? "bg-yellow-400 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-yellow-50 dark:hover:bg-gray-600"
              }
            `}
            onClick={() => setFilter("notprocessed")}
          >
            Not processed yet
          </button>
        </div>
        <TodoForm onAdd={handleAdd} />
        {notification && (
          <div
            className={`mb-6 p-3 text-base rounded-lg shadow text-center
              ${
                notification.includes("")
                  ? "bg-green-50 border border-green-400 text-green-600 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-50 border border-red-400 text-red-600 dark:bg-red-900 dark:text-red-200"
              }`}
          >
            {notification}
          </div>
        )}
        <div className="overflow-x-auto rounded-lg shadow mt-0">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-100 dark:bg-gray-800 border border-b-0 border-blue-200 dark:border-gray-700 rounded-t-lg">
            <h2 className="text-xl font-bold text-blue-700 dark:text-gray-100 tracking-wide">
              To-do List App
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg shadow mt-6">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden transition">
              <thead>
                <tr className="bg-blue-50 dark:bg-gray-800 transition">
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    No
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    Task
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    Status
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-400 dark:text-gray-500"
                    >
                      No tasks found.
                    </td>
                  </tr>
                )}
                {filteredTodos.map((todo, idx) => (
                  <tr
                    key={todo.id}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100">
                      {idx + 1}
                    </td>
                    <td
                      className={`px-4 py-3 border-b break-words max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl ${
                        todo.completed === true
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {editingId === todo.id ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                          value={editText}
                          onChange={(event) => setEditText(event.target.value)}
                          autoFocus
                        />
                      ) : (
                        todo.todo
                      )}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      {todo.completed === null ||
                      todo.completed === undefined ? (
                        <span className="text-yellow-500 font-bold text-lg">
                          ?
                        </span>
                      ) : todo.completed === false ? (
                        <span className="text-orange-500 font-bold text-lg">
                          !
                        </span>
                      ) : (
                        <svg
                          className="w-5 h-5 text-green-500 inline"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        {editingId === todo.id ? (
                          <>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs text-white"
                              onClick={() => {
                                handleEdit(todo.id, editText);
                                setEditingId(null);
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-xs text-black dark:bg-gray-700 dark:text-gray-100"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-xs text-white"
                              onClick={() => {
                                setEditingId(todo.id);
                                setEditText(todo.todo);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs text-white"
                              onClick={() => handleDelete(todo.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="bg-white border border-blue-400 hover:bg-blue-100 dark:bg-gray-800 dark:border-blue-300 dark:hover:bg-gray-700 px-2 py-1 rounded-full text-blue-600 dark:text-blue-300 flex items-center justify-center transition"
                              title="View detail"
                              onClick={() => {
                                setSelectedTask(todo);
                                setShowDetail(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                                />
                              </svg>
                            </button>
                            <button
                              className={`w-7 h-7 inline-flex items-center justify-center rounded-full border-2 transition
                              ${
                                todo.completed === true
                                  ? "bg-green-100 border-green-500"
                                  : todo.completed === false
                                    ? "bg-orange-100 border-orange-500"
                                    : "bg-yellow-100 border-yellow-500"
                              }
                            `}
                              title="Toggle status"
                              onClick={() => {
                                let nextStatus;
                                if (
                                  todo.completed === undefined ||
                                  todo.completed === null
                                ) {
                                  nextStatus = false;
                                } else if (todo.completed === false) {
                                  nextStatus = true;
                                } else if (todo.completed === true) {
                                  nextStatus = null;
                                }
                                handleToggle(todo.id, nextStatus);
                              }}
                            >
                              {todo.completed === null ||
                              todo.completed === undefined ? (
                                <span className="text-yellow-500 font-bold text-lg">
                                  ?
                                </span>
                              ) : todo.completed === false ? (
                                <span className="text-orange-500 font-bold text-lg">
                                  !
                                </span>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showDetail && selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg min-w-[320px] max-w-[90vw]">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Task Detail
            </h3>
            <div className="mb-2 text-gray-900 dark:text-gray-100">
              <b>UserId:</b> {selectedTask.userId}
            </div>
            <div className="mb-2 text-gray-900 dark:text-gray-100">
              <b>Task:</b> {selectedTask.todo}
            </div>
            <div className="mb-4 text-gray-900 dark:text-gray-100">
              <b>Status:</b>{" "}
              {selectedTask.completed === null ||
              selectedTask.completed === undefined
                ? "Not processed yet"
                : selectedTask.completed === false
                  ? "Pending"
                  : "Completed"}
            </div>
            <button
              className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium"
              onClick={() => setShowDetail(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
