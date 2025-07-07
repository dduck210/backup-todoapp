import TodoItem from "./TodoItem";

const TodoList = ({ todos, onDelete, onUpdate, onToggle, onDetail }) => (
  <div>
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onToggle={onToggle}
        onDetail={onDetail}
      />
    ))}
  </div>
);

export default TodoList;
