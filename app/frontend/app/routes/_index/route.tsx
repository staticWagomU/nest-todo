import { useState, useEffect } from 'react';
import { fetchTodos, type Todos } from './loader';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todos>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Todos</h1>
      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 bg-gray-100 p-2 mb-2 rounded shadow">
            <input
              type="checkbox"
              checked={todo.completed}
              className="form-checkbox h-5 w-5 text-blue-600"
              readOnly
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
