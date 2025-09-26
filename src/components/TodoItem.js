import { useState } from "react";

const TodoItem = ({ todo, onDelete, onToggle, onUpdate, onDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.todo);
  };

  const handleSave = () => {
    if (editText !== "") {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  // Status icon
  let statusIcon = null;
  if (todo.completed === undefined || todo.completed === null) {
    statusIcon = <span className="text-yellow-500 font-bold text-lg">?</span>;
  } else if (todo.completed === false) {
    statusIcon = <span className="text-orange-500 font-bold text-lg">!</span>;
  } else if (todo.completed === true) {
    statusIcon = (
      <svg
        className="w-5 h-5 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  // Toggle status
  const handleToggleStatus = () => {
    let nextStatus;
    if (todo.completed === undefined || todo.completed === null) {
      nextStatus = false;
    } else if (todo.completed === false) {
      nextStatus = true;
    } else if (todo.completed === true) {
      nextStatus = null;
    }
    onToggle(todo.id, nextStatus);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div
        className={`flex-1 cursor-pointer break-words truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl ${
          todo.completed === true ? "line-through text-gray-400" : ""
        }`}
        onClick={isEditing ? undefined : () => onDetail(todo)}
        title="View Details"
      >
        {isEditing ? (
          <form
            className="flex items-center gap-2 w-full"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <input
              className="border rounded px-2 py-1 flex-1"
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              autoFocus
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              readOnly={false}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-all duration-150"
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-semibold transition-all duration-150"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          todo.todo
        )}
      </div>
      <div className="flex gap-2 items-center">
        <button
          className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition
            ${
              todo.completed === true
                ? "bg-green-100 border-green-500"
                : todo.completed === false
                  ? "bg-orange-100 border-orange-500"
                  : "bg-yellow-100 border-yellow-500"
            }
          `}
          title="Change Status"
          onClick={handleToggleStatus}
        >
          {statusIcon}
        </button>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-xs text-white"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs text-white"
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </button>
        <button
          className="bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-xs text-white"
          onClick={() => onDetail(todo)}
          disabled={isEditing}
          style={isEditing ? { pointerEvents: "none", opacity: 0.5 } : {}}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
