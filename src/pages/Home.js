import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TodoForm from "../components/TodoForm";
import SearchTask from "../components/SearchTask";
import SearchUser from "../components/SearchUser";
import SearchUsername from "../components/SearchUsername";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const API_URL = "https://todo-backend-6c6i.onrender.com/todos";
const USERS_API = "https://todo-backend-6c6i.onrender.com/users";
const STATUS_BUTTON_STYLE =
  "min-w-[132px] h-12 px-4 text-base font-medium border rounded-md flex items-center justify-center transition";

const Home = () => {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isAdmin = user?.role === "admin";
  const userId = user?.id;

  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBatchEdit, setShowBatchEdit] = useState(false);
  const [batchEditValue, setBatchEditValue] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(USERS_API);
      setUsers(res.data || []);
    } catch (err) {}
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      let todoData = res.data;
      if (!isAdmin) {
        todoData = todoData.filter(
          (todo) => String(todo.userId) === String(userId)
        );
      }
      setTodos(todoData);
      setLoading(false);
    } catch (error) {
      setNotification("Unable to load data, please try again!");
      setLoading(false);
    }
  }, [isAdmin, userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    let timerId;
    if (notification) {
      timerId = setTimeout(() => setNotification(""), 1200);
    }
    return () => clearTimeout(timerId);
  }, [notification]);
  useEffect(() => {
    setEditingId(null);
  }, [search, filter, searchUserId, searchUsername]);

  const handleAdd = async (text, assignedUserId) => {
    try {
      setLoading(true);
      await axios.post(API_URL, {
        todo: text,
        completed: null,
        userId: isAdmin ? assignedUserId : userId,
      });
      await fetchData();
      toast.success("Added task successfully!");
    } catch {
      setNotification("Error adding task!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const found = todos.find((todo) => todo.id === id);
    if (!isAdmin && String(found?.userId) !== String(userId)) {
      toast.error("You can only delete your own tasks!");
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchData();
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Cannot delete task!");
    }
  };

  const handleToggle = async (id, completed) => {
    const found = todos.find((todo) => todo.id === id);
    if (!isAdmin && String(found?.userId) !== String(userId)) {
      toast.error("You can only update your own tasks!");
      return;
    }
    try {
      const updated = { ...found, completed };
      await axios.put(`${API_URL}/${id}`, updated);
      await fetchData();
      toast.success("Status updated!");
    } catch {
      setNotification("Update status failed!");
    }
  };

  const handleEdit = async (id, text) => {
    const found = todos.find((todo) => todo.id === id);
    if (!isAdmin && String(found?.userId) !== String(userId)) {
      toast.error("You can only update your own tasks!");
      return false;
    }
    if (!text || text === "") {
      toast.error("Please enter task!");
      return false;
    }
    try {
      const updated = { ...found, todo: text };
      await axios.put(`${API_URL}/${id}`, updated);
      await fetchData();
      toast.success("Fixed task!");
      return true;
    } catch {
      toast.error("Error when editing task!");
      return false;
    }
  };

  // MULTI select và thao tác hàng loạt, cho cả user bình thường
  const handleSelectTask = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected tasks?"))
      return;
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const found = todos.find((todo) => todo.id === id);
          // user không phải admin thì chỉ xoá được task của mình
          if (isAdmin || String(found?.userId) === String(userId))
            return axios.delete(`${API_URL}/${id}`);
          return null;
        })
      );
      setSelectedIds([]);
      await fetchData();
      toast.success("Deleted selected tasks!");
    } catch (err) {
      toast.error("Bulk delete failed!");
    }
  };

  // user thường chỉ update được task của chính họ, admin all
  const handleBulkStatus = async (status) => {
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const found = todos.find((t) => t.id === id);
          if (found && (isAdmin || String(found.userId) === String(userId))) {
            await axios.put(`${API_URL}/${id}`, {
              ...found,
              completed: status,
            });
          }
        })
      );
      await fetchData();
      toast.success("Updated status for selected tasks!");
    } catch (err) {
      toast.error("Bulk status update failed!");
    }
  };

  const handleBulkEdit = async () => {
    if (!batchEditValue || batchEditValue.trim() === "") {
      toast.error("Please enter content for tasks!");
      return;
    }
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const found = todos.find((t) => t.id === id);
          if (found && (isAdmin || String(found.userId) === String(userId))) {
            await axios.put(`${API_URL}/${id}`, {
              ...found,
              todo: batchEditValue,
            });
          }
        })
      );
      setShowBatchEdit(false);
      setSelectedIds([]);
      setBatchEditValue("");
      await fetchData();
      toast.success("Edited all selected tasks!");
    } catch (err) {
      toast.error("Bulk edit failed!");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchUser =
      !isAdmin || !searchUserId || String(todo.userId) === String(searchUserId);
    const matchFilter =
      (filter === "completed" && todo.completed === true) ||
      (filter === "uncompleted" && todo.completed === false) ||
      (filter === "notprocessed" &&
        (todo.completed === null || todo.completed === undefined)) ||
      filter === "all";
    const matchSearch = todo.todo
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const userObj = users.find((u) => String(u.id) === String(todo.userId));
    const username = userObj ? userObj.username : "";
    const matchUsername =
      searchUsername.trim() === "" ||
      username.toLowerCase().includes(searchUsername.trim().toLowerCase());

    return matchUser && matchFilter && matchSearch && matchUsername;
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
    <section className="w-full min-h-screen flex justify-center bg-gray-50 dark:bg-gray-800 rounded-xl transition pb-5">
      <div className="w-full flex-1 bg-white dark:bg-gray-700 shadow-xl p-8 mt-0 py-5 transition">
        <div className="mb-0">
          <SearchTask onSearch={setSearch} />
          {isAdmin && (
            <SearchUser
              users={users}
              value={searchUserId}
              onChange={setSearchUserId}
            />
          )}
          {isAdmin && (
            <div className="mt-2 mb-4">
              <SearchUsername
                value={searchUsername}
                onChange={setSearchUsername}
              />
            </div>
          )}
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
            New
          </button>
        </div>

        <TodoForm
          onAdd={handleAdd}
          users={users}
          isAdmin={isAdmin}
          currentUserId={userId}
        />

        <div className="flex gap-3 mb-4 mt-6">
          <button
            className="px-3 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </button>
          <button
            className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            onClick={() => handleBulkStatus(true)}
            disabled={selectedIds.length === 0}
          >
            Mark Completed
          </button>
          <button
            className="px-3 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
            onClick={() => handleBulkStatus(false)}
            disabled={selectedIds.length === 0}
          >
            Mark Uncompleted
          </button>
          <button
            className="px-3 py-2 bg-yellow-400 text-white rounded disabled:opacity-50"
            onClick={() => handleBulkStatus(null)}
            disabled={selectedIds.length === 0}
          >
            Mark New
          </button>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => setShowBatchEdit(true)}
            disabled={selectedIds.length === 0}
          >
            Edit Selected
          </button>
        </div>

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

        <div className="rounded-lg shadow mt-0">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-100 dark:bg-gray-800 border border-b-0 border-blue-200 dark:border-gray-700 mt-6">
            <h2 className="text-xl font-bold text-blue-700 dark:text-gray-100 tracking-wide">
              To-do List App
            </h2>
          </div>
          <div className="overflow-x-auto shadow mt-0">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden transition">
              <thead>
                <tr className="bg-blue-50 dark:bg-gray-800 transition">
                  <th className="px-2 py-3 border-b text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredTodos.length > 0 &&
                        filteredTodos.every((todo) =>
                          selectedIds.includes(todo.id)
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(filteredTodos.map((todo) => todo.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    No
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    User
                  </th>
                  <th className="px-4 py-3 border-b text-left text-gray-900 dark:text-gray-100 font-bold">
                    Task
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    Status
                  </th>
                  <th className="px-2 pr-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold w-1 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
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
                    <td className="px-2 py-3 border-b text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(todo.id)}
                        onChange={() => handleSelectTask(todo.id)}
                      />
                    </td>
                    <td className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100">
                      {users.find((u) => String(u.id) === String(todo.userId))
                        ?.username || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-3 border-b text-left break-words max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl ${
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
                    <td className="px-4 py-3 border-b text-center align-middle">
                      <button
                        className={
                          STATUS_BUTTON_STYLE +
                          " " +
                          (todo.completed === true
                            ? "bg-green-50 text-green-600 border-green-500"
                            : todo.completed === false
                              ? "bg-orange-50 text-orange-600 border-orange-500"
                              : "bg-yellow-50 text-yellow-600 border-yellow-500")
                        }
                        style={{ margin: "0 auto" }}
                        title="Click to change status"
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
                        {todo.completed === null || todo.completed === undefined
                          ? "New"
                          : todo.completed === false
                            ? "Uncompleted"
                            : "Completed"}
                      </button>
                    </td>
                    <td className="px-2 pr-4 py-3 border-b text-center align-middle w-1 whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        {editingId === todo.id ? (
                          <>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-blue-600 hover:bg-blue-700 text-white"
                              }
                              onClick={async () => {
                                const success = await handleEdit(
                                  todo.id,
                                  editText
                                );
                                if (success) setEditingId(null);
                              }}
                            >
                              Save
                            </button>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-gray-100"
                              }
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-white border border-blue-400 hover:bg-blue-100 dark:bg-gray-800 dark:border-blue-300 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-300"
                              }
                              title="View detail"
                              onClick={() => {
                                setSelectedTask(todo);
                                setShowDetail(true);
                              }}
                            >
                              View Detail
                            </button>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-yellow-400 hover:bg-yellow-500 text-white"
                              }
                              onClick={() => {
                                setEditingId(todo.id);
                                setEditText(todo.todo);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-red-500 hover:bg-red-600 text-white"
                              }
                              onClick={() => handleDelete(todo.id)}
                            >
                              Delete
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
      {showBatchEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <h4 className="font-bold mb-2">Edit Selected Tasks</h4>
            <textarea
              className="border rounded px-2 py-1 w-full min-h-[60px] dark:bg-gray-900 dark:text-white"
              value={batchEditValue}
              onChange={(e) => setBatchEditValue(e.target.value)}
              placeholder="Enter new task content"
            />
            <div className="mt-4 flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleBulkEdit}
              >
                Save All
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowBatchEdit(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg min-w-[320px] max-w-[90vw]">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Task Detail
            </h3>
            <div className="mb-2 text-gray-900 dark:text-gray-100">
              <b>User:</b>{" "}
              {users.find((u) => String(u.id) === String(selectedTask.userId))
                ?.username || selectedTask.userId}
            </div>
            <div className="mb-2 text-gray-900 dark:text-gray-100">
              <b>Task:</b> {selectedTask.todo}
            </div>
            <div className="mb-4 text-gray-900 dark:text-gray-100">
              <b>Status:</b>{" "}
              {selectedTask.completed === null ||
              selectedTask.completed === undefined
                ? "New"
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
