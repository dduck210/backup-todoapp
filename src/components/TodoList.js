// import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TodoList = ({
  todos,
  onDelete,
  onUpdate,
  onToggle,
  onDetail,
  onReorder,
  selectedIds,
  onSelectTask,
  editingId,
  editText,
  setEditingId,
  setEditText,
  users,
  page,
  itemsPerPage,
  changingStatusId,
  handleTogglePriority,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newTodos = Array.from(todos);
    const [removed] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, removed);
    if (onReorder) onReorder(newTodos);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <tbody ref={provided.innerRef} {...provided.droppableProps}>
            {todos.map((todo, idx) => (
              <Draggable
                key={todo.id}
                draggableId={String(todo.id)}
                index={idx}
              >
                {(provided) => (
                  <tr
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  >
                    {/* Checkbox */}
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(todo.id)}
                        onChange={() => onSelectTask(todo.id)}
                      />
                    </td>
                    {/* Number */}
                    <td className="px-3 py-3 text-center">
                      {(page - 1) * itemsPerPage + idx + 1}
                    </td>
                    {/* User */}
                    <td className="px-3 py-3 text-center">
                      {users.find((u) => String(u.id) === String(todo.userId))
                        ?.username || "N/A"}
                    </td>
                    {/* Task */}
                    <td
                      className={`px-3 py-3 text-left break-words max-w-xs sm:max-w-md ${
                        todo.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {editingId === todo.id ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm bg-white dark:bg-gray-800"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        todo.todo
                      )}
                    </td>
                    {/* Priority */}
                    <td className="px-3 py-3 text-center">
                      <button
                        className={`text-lg ${
                          todo.priority
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                        onClick={() => handleTogglePriority(todo)}
                        disabled={changingStatusId === todo.id}
                      >
                        {todo.priority ? "★" : "☆"}
                      </button>
                    </td>
                    {/* Status */}
                    <td className="px-3 py-3 text-center">
                      <button
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
                          todo.completed === true
                            ? "bg-green-50 text-green-600 border-green-400"
                            : todo.completed === false
                              ? "bg-red-50 text-red-600 border-red-400"
                              : "bg-yellow-50 text-yellow-600 border-yellow-400"
                        } ${changingStatusId === todo.id ? "opacity-50" : ""}`}
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
                          onToggle(todo.id, nextStatus);
                        }}
                        disabled={changingStatusId === todo.id}
                      >
                        {changingStatusId === todo.id
                          ? "..."
                          : todo.completed === null ||
                              todo.completed === undefined
                            ? "New"
                            : todo.completed === false
                              ? "Incomplete"
                              : "Completed"}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {editingId === todo.id ? (
                          <>
                            <button
                              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs"
                              onClick={async () => {
                                const success = await onUpdate(
                                  todo.id,
                                  editText
                                );
                                if (success) setEditingId(null);
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 text-xs"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              title="View Details"
                              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700"
                              onClick={() => onDetail(todo)}
                            >
                              🔍
                            </button>
                            <button
                              title="Edit"
                              className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setEditingId(todo.id);
                                setEditText(todo.todo);
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              title="Delete"
                              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-700"
                              onClick={() => onDelete(todo.id)}
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
