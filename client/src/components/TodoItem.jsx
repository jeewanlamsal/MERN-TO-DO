import api from '../api';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const toggleComplete = async () => {
    try {
      const res = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
      onUpdate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async () => {
    try {
      await api.delete(`/todos/${todo._id}`);
      onDelete(todo._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between border p-2 mb-2 rounded">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
        />
        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={deleteTodo}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
}
