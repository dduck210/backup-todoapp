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
      setNotification(
        "데이터를 불러올 수 없습니다. 나중에 다시 시도해 주세요!"
      );
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
      toast.success("작업이 성공적으로 추가되었습니다!");
    } catch {
      setNotification("작업 추가 중 오류가 발생했습니다!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("이 작업을 정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchData();
      toast.success("작업이 삭제되었습니다!");
    } catch (err) {
      toast.error("작업을 삭제할 수 없습니다!");
    }
  };

  const handleToggle = async (id, completed) => {
    if (changingStatusId !== null) return;
    setChangingStatusId(id);
    try {
      const found = todos.find((todo) => todo.id === id);
      await axios.put(`${API_URL}/${id}`, { ...found, completed });
      await fetchData();
      toast.success("상태가 업데이트되었습니다!");
    } catch {
      setNotification("상태 업데이트에 실패했습니다!");
    } finally {
      setChangingStatusId(null);
    }
  };

  const handleEdit = async (id, text) => {
    const found = todos.find((todo) => todo.id === id);
    if (!text || text === "") {
      toast.error("작업 내용을 입력하세요!");
      return false;
    }
    try {
      const updated = { ...found, todo: text };
      await axios.put(`${API_URL}/${id}`, updated);
      await fetchData();
      toast.success("작업이 수정되었습니다!");
      return true;
    } catch {
      toast.error("작업 수정 중 오류가 발생했습니다!");
      return false;
    }
  };

  const handleSelectTask = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("선택한 작업을 삭제하시겠습니까?")) return;
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
      toast.success("선택한 작업들이 삭제되었습니다!");
    } catch (err) {
      toast.error("일괄 삭제에 실패했습니다!");
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
      toast.success("선택한 작업들의 상태가 업데이트되었습니다!");
    } catch (err) {
      toast.error("일괄 상태 변경에 실패했습니다!");
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
        !todo.priority
          ? "우선순위로 지정되었습니다!"
          : "우선순위가 해제되었습니다!"
      );
    } catch (err) {
      toast.error("우선순위 업데이트에 실패했습니다!");
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
      toast.warn("내보낼 작업이 없습니다!");
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
            ? "완료됨"
            : todo.completed === false
              ? "미완료"
              : "새로운",
          todo.priority ? "우선순위" : "",
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

  // Các biến thống kê dùng cho header, tránh lặp lại filter trong JSX!
  const totalTasks = filteredTodos.length;
  const completedTasks = filteredTodos.filter(
    (t) => t.completed === true
  ).length;
  const uncompletedTasks = filteredTodos.filter(
    (t) => t.completed === false
  ).length;
  const newTasks = filteredTodos.filter(
    (t) => t.completed === null || t.completed === undefined
  ).length;
  const totalPriority = filteredTodos.filter((t) => t.priority).length;

  const percentCompleted =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const percentUncompleted =
    totalTasks > 0 ? Math.round((uncompletedTasks / totalTasks) * 100) : 0;
  const percentNew =
    totalTasks > 0 ? Math.round((newTasks / totalTasks) * 100) : 0;
  const percentPriority =
    totalTasks > 0 ? Math.round((totalPriority / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <span className="text-blue-600 font-semibold text-lg mb-4">
          로딩 중...
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
              전체
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "completed"
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("completed")}
            >
              완료됨
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "uncompleted"
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("uncompleted")}
            >
              미완료
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded transition font-medium h-12 ${
                filter === "new"
                  ? "bg-yellow-400 text-white shadow"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-yellow-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFilter("new")}
            >
              새로운
            </button>
            <button
              className={`px-5 py-2 rounded transition font-medium h-12 ${
                priorityFilter === "all"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-100 text-purple-700 dark:bg-gray-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setPriorityFilter("all")}
            >
              전체
            </button>
            <button
              className={`px-5 py-2 rounded transition font-medium h-12 ${
                priorityFilter === "priority"
                  ? "bg-yellow-400 text-white shadow"
                  : "bg-gray-100 text-yellow-600 dark:bg-gray-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setPriorityFilter("priority")}
            >
              우선순위 ⭐
            </button>
            <button
              className={`px-5 py-2 rounded transition font-medium h-12 ${
                priorityFilter === "normal"
                  ? "bg-gray-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setPriorityFilter("normal")}
            >
              일반
            </button>
          </div>
          <div className="max-w-md mx-auto md:max-w-full md:mx-0 flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
            <button
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={() => handleBulkStatus(true)}
              disabled={selectedIds.length === 0}
            >
              완료로 표시
            </button>
            <button
              className="flex-1 px-3 py-2 bg-orange-600 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={() => handleBulkStatus(false)}
              disabled={selectedIds.length === 0}
            >
              미완료로 표시
            </button>
            <button
              className="flex-1 px-3 py-2 bg-yellow-400 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={() => handleBulkStatus(null)}
              disabled={selectedIds.length === 0}
            >
              새로운로 표시
            </button>
            <button
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded disabled:opacity-50 h-12 whitespace-nowrap"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
            >
              선택 삭제
            </button>
            <button
              className="flex-1 px-3 py-2 bg-blue-800 text-white rounded h-12 whitespace-nowrap"
              onClick={exportToCSV}
            >
              CSV 내보내기 🡇
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
              투두 리스트 앱
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-5 text-sm text-blue-800 dark:text-white font-semibold items-center">
              <span>
                전체 <b>{totalTasks}</b>
              </span>
              <span>
                완료됨{" "}
                <b>
                  {completedTasks} ({percentCompleted}%)
                </b>
              </span>
              <span>
                미완료{" "}
                <b>
                  {uncompletedTasks} ({percentUncompleted}%)
                </b>
              </span>
              <span>
                새로운{" "}
                <b>
                  {newTasks} ({percentNew}%)
                </b>
              </span>
              <span>
                우선순위{" "}
                <b>
                  {totalPriority} ({percentPriority}%)
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
                    번호
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    사용자
                  </th>
                  <th className="px-4 py-3 border-b text-left text-gray-900 dark:text-gray-100 font-bold">
                    작업
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    우선순위
                  </th>
                  <th className="px-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold">
                    상태
                  </th>
                  <th className="px-2 pr-4 py-3 border-b text-center text-gray-900 dark:text-gray-100 font-bold w-1 whitespace-nowrap">
                    동작
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
                      작업이 없습니다.
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
                          todo.priority ? "우선순위 해제" : "우선순위로 지정"
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
                        title="상태 변경"
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
                            ? "새로운"
                            : todo.completed === false
                              ? "미완료"
                              : "완료됨"}
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
                              저장
                            </button>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-gray-100"
                              }
                              onClick={() => setEditingId(null)}
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-white border border-blue-400 hover:bg-blue-100 dark:bg-gray-800 dark:border-blue-300 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-300"
                              }
                              title="상세 보기"
                              onClick={() => {
                                setSelectedTask(todo);
                                setShowDetail(true);
                              }}
                            >
                              상세 보기
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
                              수정
                            </button>
                            <button
                              className={
                                STATUS_BUTTON_STYLE +
                                " bg-red-500 hover:bg-red-600 text-white"
                              }
                              onClick={() => handleDelete(todo.id)}
                            >
                              삭제
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
                &lt; 이전
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
                다음 &gt;
              </button>
            </div>
          )}
        </div>
        {showDetail && selectedTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg min-w-[320px] max-w-[90vw]">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                작업 상세
              </h3>
              <div className="mb-2 text-gray-900 dark:text-gray-100">
                <b>사용자:</b>{" "}
                {users.find((u) => String(u.id) === String(selectedTask.userId))
                  ?.username || selectedTask.userId}
              </div>
              <div className="mb-2 text-gray-900 dark:text-gray-100">
                <b>작업:</b> {selectedTask.todo}
              </div>
              <div className="mb-2 text-gray-900 dark:text-gray-100">
                <b>우선순위:</b>{" "}
                {selectedTask.priority ? "우선순위 ⭐" : "일반"}
              </div>
              <div className="mb-4 text-gray-900 dark:text-gray-100">
                <b>상태:</b>{" "}
                {selectedTask.completed === null ||
                selectedTask.completed === undefined
                  ? "새로운"
                  : selectedTask.completed === false
                    ? "대기중"
                    : "완료됨"}
              </div>
              <button
                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium"
                onClick={() => setShowDetail(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
