import * as v from "valibot";

const TodoSchema = v.array(
  v.object({
    id: v.pipe(v.string(), v.uuid()),
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  })
);

export const TodoLoader = async () => {
  const res = await fetch('http://localhost:3000/todos');
  if (!res.ok) {
    throw new Response(null, { status: 404 });
  }
  const data = await res.json();
  try {
    const validData = v.parse(TodoSchema, data);
    return validData;
  }catch(e) {
    throw new Response(null, { status: 500 });
  }
};

export type TodoLoader = typeof TodoLoader;
