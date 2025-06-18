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

export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export const createTodo = async (todoData: CreateTodoRequest): Promise<Todo> => {
  try {
    console.log('Creating todo:', todoData);
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    console.log('Create response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Create API Error:', errorText);
      throw new Error(`Failed to create todo: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Created todo data:', data);

    const validData = v.parse(v.object({
      id: v.pipe(v.string(), v.uuid()),
      title: v.string(),
      description: v.string(),
      completed: v.boolean(),
    }), data);
    
    return validData;
  } catch (error) {
    console.error('Create todo error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while creating todo');
  }
};
