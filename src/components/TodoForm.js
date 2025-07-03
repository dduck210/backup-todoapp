import { useState } from "react";
import { toast } from "react-toastify";

const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text) {
      toast.info("Please enter task!");
      return;
    }
    setError("");
    onAdd(text);
    setText("");
  };

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 mb-0 w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col w-65 sm:w-80">
        <input
          className={`border ${error ? "border-red-400" : "border-blue-300"} focus:border-blue-500 outline-none rounded-lg px-4 py-2 text-base shadow-sm transition-all duration-150 placeholder-gray-400 bg-white`}
          placeholder="Enter new task..."
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError("");
          }}
          maxLength={100}
        />
        {error ? (
          <span className="text-red-500 text-sm mt-1 min-h-[20px]">
            {error}
          </span>
        ) : (
          <span className="invisible text-sm mt-1 min-h-[20px]">
            placeholder
          </span>
        )}
      </div>
      <button
        className="px-6 py-2 mb-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold shadow transition-all duration-150 w-full sm:w-auto"
        type="submit"
      >
        Add
      </button>
    </form>
  );
};

export default TodoForm;
