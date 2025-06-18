import { useState, useEffect } from 'react';
import { Title, Text, Card, Checkbox, Stack, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchTodos, type Todos, type Todo } from './loader';

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
    return <Loader size="lg" />;
  }

  if (error) {
    return (
      <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />}>
        {error}
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Title order={1}>Todos</Title>
      <Stack gap="sm">
        {todos.map((todo: Todo) => (
          <Card key={todo.id} shadow="sm" padding="md" radius="md" withBorder>
            <Checkbox
              checked={todo.completed}
              label={
                <Text
                  td={todo.completed ? 'line-through' : 'none'}
                  c={todo.completed ? 'dimmed' : 'inherit'}
                >
                  {todo.title}
                </Text>
              }
              readOnly
            />
            {todo.description && (
              <Text size="sm" c="dimmed" mt="xs">
                {todo.description}
              </Text>
            )}
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
