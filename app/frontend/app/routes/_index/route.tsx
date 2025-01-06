import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TodoLoader } from "./loader";

export let loader = TodoLoader;
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const todos = useLoaderData<TodoLoader>();
  return (
  <>
    <h1 className="text-3xl font-bold mb-4">Todos</h1>
    <ul className="list-disc pl-5">
      {todos.map(todo => (
        <li 
          key={todo.id} 
          className="flex items-center gap-2 bg-gray-100 p-2 mb-2 rounded shadow"
        >
          <input 
            type="checkbox" 
            checked={todo.completed} 
            className="form-checkbox h-5 w-5 text-blue-600"
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

