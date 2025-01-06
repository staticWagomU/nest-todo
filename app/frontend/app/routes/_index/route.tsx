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
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <h2>{todo.title}</h2>
          <p>{todo.completed ? "Completed" : "Not completed"}</p>
        </div>
      ))}
    </div>
  );
}

