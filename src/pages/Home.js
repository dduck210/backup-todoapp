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
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

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
      setTodos(
        [...todoData].sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0) ||
            Number(b.id) - Number(a.id)
        )
      );
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
  }, [search, filter, searchUserId, searchUsername, priorityFilter]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => todos.some((todo) => todo.id === id))
    );
  }, [todos]);

  useEffect(() => {
    setPage(1);
  }, [filter, priorityFilter, search, searchUserId, searchUsername]);

  const handleAdd = async (text, assignedUserId) => {
    try {
      setLoading(true);
      const res = await axios.post(API_URL, {
        todo: text,
        completed: null,
        userId: isAdmin ? assignedUserId : userId,
        priority: false,
      });
      setTodos((prev) => [res.data, ...prev]);
      toast.success("Added task successfully!");
    } catch {
      setNotification("Error adding task!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchData();
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Cannot delete task!");
    }
  };

  const handleToggle = async (id, completed) => {
    if (changingStatusId !== null) return;
    setChangingStatusId(id);
    try {
      const found = todos.find((todo) => todo.id === id);
      await axios.put(`${API_URL}/${id}`, { ...found, completed });
      await fetchData();
      toast.success("Status updated!");
    } catch {
      setNotification("Update status failed!");
    } finally {
      setChangingStatusId(null);
    }
  };

  const handleEdit = async (id, text) => {
    const found = todos.find((todo) => todo.id === id);
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

  const handleSelectTask = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected task?"))
      return;
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const found = todos.find((todo) => todo.id === id);
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

  const handleTogglePriority = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        ...todo,
        priority: !todo.priority,
      });
      await fetchData();
      toast.success(
        !todo.priority ? "Marked as Priority!" : "Unmarked as Priority!"
      );
    } catch (err) {
      toast.error("Failed to update priority!");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchUser =
      !isAdmin || !searchUserId || String(todo.userId) === String(searchUserId);
    const matchFilter =
      (filter === "completed" && todo.completed === true) ||
      (filter === "uncompleted" && todo.completed === false) ||
      (filter === "new" &&
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

    const matchPriority =
      priorityFilter === "all" ||
      (priorityFilter === "priority" && !!todo.priority) ||
      (priorityFilter === "normal" && !todo.priority);

    return (
      matchUser && matchFilter && matchSearch && matchUsername && matchPriority
    );
  });

  const paginatedTodos = filteredTodos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  const exportToCSV = () => {
    if (!filteredTodos.length) {
      toast.warn("Không có task nào để export!");
      return;
    }
    const fields = ["id", "todo", "username", "completed", "priority"];
    const replacer = (key, value) =>
      value === null || value === undefined ? "" : value;

    const rows = [
      fields.join(","),
      ...filteredTodos.map((todo) => {
        const userObj =
          users.find((u) => String(u.id) === String(todo.userId)) || {};
        return [
          todo.id,
          `"${todo.todo.replaceAll('"', '""')}"`,
          userObj.username || "",
          todo.completed === true
            ? "Completed"
            : todo.completed === false
              ? "Uncompleted"
              : "New",
          todo.priority ? "Priority" : "",
        ]
          .map((field) => JSON.stringify(field, replacer))
          .join(",");
      }),
    ].join("\r\n");

    const blob = new Blob([rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo-list.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totalPriority = filteredTodos.filter((t) => t.priority).length;
  const percentCompleted = filteredTodos.length
    ? Math.round(
        (filteredTodos.filter((t) => t.completed === true).length /
          filteredTodos.length) *
          100
      )
    : 0;

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
    <section className="w-full min-h-screen flex justify-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full flex-1 bg-white dark:bg-gray-700 shadow-xl p-0 transition">
        <div className="w-full flex flex-col gap-3 py-4 px-2">
          <div className="w-full flex flex-col md:flex-row md:gap-3 md:items-center md:justify-between max-w-md mx-auto md:max-w-full md:mx-0">
            {isAdmin && (
              <div className="w-full mb-2 md:mb-0 md:w-1/5">
                <SearchUser
                  users={users}
                  value={searchUserId}
                  onChange={setSearchUserId}
                />
              </div>
            )}
            <div
              className={`w-full mb-2 md:mb-0 ${isAdmin ? "md:w-1/4" : "md:w-1/3"}`}
            >
              <SearchTask onSearch={setSearch} />
            </div>
            <div
              className={`w-full mb-2 md:mb-0 ${isAdmin ? "md:w-1/4" : "md:w-1/3"}`}
            >
              <SearchUsername
                value={searchUsername}
                onChange={setSearchUsername}
              />
            </div>
            <div className={`w-full md:w-1/3`}>
              <TodoForm
                onAdd={handleAdd}
                users={users}
                isAdmin={isAdmin}
                currentUserId={userId}
              />
            </div>
          </div>

          <div className="max-w-md mx-auto md:max-w-full md:mx-0 flex flex-wrap gap-2 justify-center md:justify-start mb-2">
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "completed"
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "uncompleted"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("uncompleted")}
            >
              Uncompleted
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "new"
                  ? "bg-yellow-400 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-yellow-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("new")}
            >
              New
            </button>
            <button
              className={`px-5 py-2 rounded transition font-medium h-12 ${
                priorityFilter === "all"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-100 text-purple-700 dark:bg-gray-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setPriorityFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`px-5 py-2 rounded transition font-medium h-12 ${
                priorityFilter === "priority"
                  ? "bg-yellow-400 text-white shadow"
                  : "bg-gray-100 text-yellow-600 dark:bg-gray-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setPriorityFilter("priority")}
            >
              Priority ⭐
            </button>
            <button
              className={`px-5 py-2 rounded transition font-medium h-12 ${
                priorityFilter === "normal"
                  ? "bg-gray-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setPriorityFilter("normal")}
            >
              Normal
            </button>
          </div>
          <div className="max-w-md mx-auto md:max-w-full md:mx-0 flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
            <button
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={() => handleBulkStatus(true)}
              disabled={selectedIds.length === 0}
            >
              Mark Completed
            </button>
            <button
              className="flex-1 px-3 py-2 bg-orange-600 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={() => handleBulkStatus(false)}
              disabled={selectedIds.length === 0}
            >
              Mark Uncompleted
            </button>
            <button
              className="flex-1 px-3 py-2 bg-yellow-400 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={() => handleBulkStatus(null)}
              disabled={selectedIds.length === 0}
            >
              Mark New
            </button>
            <button
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
            >
              Delete Selected
            </button>
            <button
              className="flex-1 px-3 py-2 bg-blue-800 text-white rounded h-12 whitespace-nowrap"
              onClick={exportToCSV}
            >
              Export CSV 🡇
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`mb-2 p-3 text-base rounded-lg shadow text-center ${
              notification.includes("")
                ? "bg-green-50 border border-green-400 text-green-600 dark:bg-green-900 dark:text-green-200"
                : "bg-red-50 border border-red-400 text-red-600 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {notification}
          </div>
        )}
        <div className="rounded-lg shadow mt-0">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-100 dark:bg-gray-800 border border-b-0 border-blue-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-blue-700 dark:text-gray-100 tracking-wide">
              To-do List App
            </h2>
            <div className="flex flex-col md:flex-row gap-2 text-sm text-blue-800 dark:text-white font-semibold">
              <span>
                Total: <b>{filteredTodos.length}</b>
              </span>
              <span>
                Priority: <b>{totalPriority}</b>
              </span>
              <span>
                Completed:{" "}
                <b>
                  {filteredTodos.filter((t) => t.completed === true).length} (
                  {percentCompleted}%)
                </b>
              </span>
              <span>
                Uncompleted:{" "}
                <b>
                  {filteredTodos.filter((t) => t.completed === false).length}
                </b>
              </span>
              <span>
                New:{" "}
                <b>
                  {
                    filteredTodos.filter(
                      (t) => t.completed === null || t.completed === undefined
                    ).length
                  }
                </b>
              </span>
            </div>
          </div>
          <div className="overflow-x-auto shadow mt-0">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden transition">
              <thead>
                <tr className="bg-blue-50 dark:bg-gray-800 transition">
                  <th className="px-2 py-3 border-b text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedTodos.length > 0 &&
                        paginatedTodos.every((todo) =>
                          selectedIds.includes(todo.id)
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(paginatedTodos.map((todo) => todo.id));
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
                    Priority
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
                {paginatedTodos.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-400 dark:text-gray-500"
                    >
                      No tasks found.
                    </td>
                  </tr>
                )}
                {paginatedTodos.map((todo, idx) => (
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
                      {(page - 1) * itemsPerPage + idx + 1}
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
                        className={`text-xl select-none focus:outline-none ${
                          todo.priority
                            ? "text-yellow-400"
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                        title={`${
                          todo.priority ? "uncheck priority" : "mark priority"
                        }`}
                        onClick={() => handleTogglePriority(todo)}
                        disabled={changingStatusId === todo.id}
                      >
                        {todo.priority ? "★" : "☆"}
                      </button>
                    </td>
                    <td className="px-4 py-3 border-b text-center align-middle">
                      <button
                        className={
                          STATUS_BUTTON_STYLE +
                          (changingStatusId === todo.id ? " opacity-50" : "") +
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
                          if (changingStatusId === todo.id) return;
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
                        disabled={changingStatusId === todo.id}
                      >
                        {changingStatusId === todo.id
                          ? "..."
                          : todo.completed === null ||
                              todo.completed === undefined
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
          {totalPages > 1 && (
            <div className="my-4 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              >
                &lt; Prev
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-2 rounded ${
                    page === idx + 1
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-blue-800 dark:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>
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
              <div className="mb-2 text-gray-900 dark:text-gray-100">
                <b>Priority:</b>{" "}
                {selectedTask.priority ? "Priority ⭐" : "Normal"}
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
      </div>
    </section>
  );
};

export default Home;
