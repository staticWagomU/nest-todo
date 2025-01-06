export const TodoLoader = async () => {
  const res = await fetch('http://localhost:3000/todos');
  if (!res.ok) {
    throw new Response(null, { status: 404 });
  }

  return await res.json();
};

export type TodoLoader = typeof TodoLoader;
