import * as v from "valibot";

export const TodoSchema = v.array(
  v.object({
    id: v.pipe(v.string(), v.uuid()),
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  })
);

export type Todo = v.Output<typeof TodoSchema>[number];
export type Todos = v.Output<typeof TodoSchema>;

export const fetchTodos = async (): Promise<Todos> => {
  const res = await fetch('/api/todos');
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  const data = await res.json();
  try {
    const validData = v.parse(TodoSchema, data);
    return validData;
  } catch(e) {
    throw new Error('Invalid data format');
  }
};