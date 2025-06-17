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
  try {
    console.log('Fetching todos from /api/todos...');
    const res = await fetch('/api/todos');
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Received data:', data);
    
    const validData = v.parse(TodoSchema, data);
    return validData;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching todos');
  }
};