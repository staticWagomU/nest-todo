import { useState, useEffect } from 'react';
import { Title, Text, Card, Checkbox, Stack, Loader, Alert, Button, Modal, TextInput, Textarea, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { fetchTodos, createTodo, type Todos, type Todo, type CreateTodoRequest } from './loader';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todos>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<CreateTodoRequest>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      completed: false,
    },
    validate: {
      title: (value) => value.trim().length < 3 ? 'タイトルは3文字以上で入力してください' : null,
    },
  });

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

  const handleSubmit = async (values: CreateTodoRequest) => {
    setSubmitting(true);
    try {
      await createTodo(values);
      form.reset();
      close();
      // Refresh todos list
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setSubmitting(false);
    }
  };

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
    <>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={1}>Todos</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={open}
            variant="filled"
            color="blue"
          >
            Todo を追加
          </Button>
        </Group>
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

      <Modal
        opened={opened}
        onClose={close}
        title="新しいTodoを追加"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="タイトル"
              placeholder="Todoのタイトルを入力してください"
              withAsterisk
              key={form.key('title')}
              {...form.getInputProps('title')}
            />
            <Textarea
              label="説明"
              placeholder="Todoの説明を入力してください（任意）"
              rows={3}
              key={form.key('description')}
              {...form.getInputProps('description')}
            />
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                onClick={close}
                disabled={submitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                loading={submitting}
                color="blue"
              >
                追加
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
