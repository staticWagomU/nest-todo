import * as v from 'valibot';

export const TodoSchema = v.array(
  v.object({
    id: v.pipe(v.string(), v.uuid()),
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  })
);

export type Todo = v.InferOutput<typeof TodoSchema>[number];
export type Todos = v.InferOutput<typeof TodoSchema>;

export const fetchTodos = async (): Promise<Todos> => {
  try {
    const res = await fetch('/api/todos');

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const validData = v.parse(TodoSchema, data);
    return validData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching todos');
  }
};

export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export const createTodo = async (todoData: CreateTodoRequest): Promise<Todo> => {
  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create todo: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const validData = v.parse(
      v.object({
        id: v.pipe(v.string(), v.uuid()),
        title: v.string(),
        description: v.string(),
        completed: v.boolean(),
      }),
      data
    );

    return validData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while creating todo');
  }
};
