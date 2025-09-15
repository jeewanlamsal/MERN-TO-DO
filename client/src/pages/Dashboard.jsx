import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch todos when the page loads
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await api.get('/todos');
        setTodos(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token invalid or missing → redirect to login
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [navigate]);

  // Add new todo to state
  const addTodo = (newTodo) => {
    setTodos([newTodo, ...todos]);
  };

  // Update a todo in state
  const updateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo));
  };

  // Remove a todo from state
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo._id !== id));
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto ml-28 mt-10 p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <ThemeToggle />
      </div>
      <TodoForm onAdd={addTodo} />
      <div className="mt-4">
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
