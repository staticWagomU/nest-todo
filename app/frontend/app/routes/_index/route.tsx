import { useState, useEffect, Suspense } from 'react';
import {
  Title,
  Text,
  Card,
  Checkbox,
  Stack,
  Loader,
  Alert,
  Button,
  Modal,
  TextInput,
  Textarea,
  Group,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  type Todos,
  type Todo,
  type CreateTodoRequest,
} from './loader';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todos>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingTodos, setUpdatingTodos] = useState<Set<string>>(new Set());
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<CreateTodoRequest>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      completed: false,
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? 'タイトルは3文字以上で入力してください' : null),
    },
  });

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleSubmit = async (values: CreateTodoRequest) => {
    setSubmitting(true);
    try {
      const newTodo = await createTodo(values);
      form.reset();
      close();
      // Add new todo to existing list instead of refetching all data
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCompleted = async (id: string, completed: boolean) => {
    // Add to updating set
    setUpdatingTodos((prev) => new Set(prev).add(id));

    try {
      const updatedTodo = await updateTodo(id, { completed });

      // Update the todo in the list
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      // Show error toast
      notifications.show({
        title: 'エラー',
        message: 'Todoの更新に失敗しました',
        color: 'red',
      });

      console.error('Failed to update todo:', err);
    } finally {
      // Remove from updating set
      setUpdatingTodos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

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
            disabled={loading}
          >
            Todo を追加
          </Button>
        </Group>

        {error && (
          <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="md" />
            <Text>Loading todos...</Text>
          </Group>
        ) : (
          <Stack gap="sm">
            {todos.length === 0 ? (
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Text ta="center" c="dimmed">
                  まだTodoがありません。新しいTodoを追加してみましょう！
                </Text>
              </Card>
            ) : (
              todos.map((todo: Todo) => {
                const isUpdating = updatingTodos.has(todo.id);
                return (
                  <Card key={todo.id} shadow="sm" padding="md" radius="md" withBorder>
                    <Suspense fallback={<Loader size="sm" />}>
                      <Group>
                        <Checkbox
                          checked={todo.completed}
                          onChange={(event) =>
                            handleToggleCompleted(todo.id, event.currentTarget.checked)
                          }
                          disabled={isUpdating}
                          label={
                            <Text
                              td={todo.completed ? 'line-through' : 'none'}
                              c={todo.completed ? 'dimmed' : 'inherit'}
                            >
                              {todo.title}
                            </Text>
                          }
                        />
                        {isUpdating && <Loader size="xs" />}
                      </Group>
                    </Suspense>
                    {todo.description && (
                      <Text size="sm" c="dimmed" mt="xs">
                        {todo.description}
                      </Text>
                    )}
                  </Card>
                );
              })
            )}
          </Stack>
        )}
      </Stack>

      <Modal opened={opened} onClose={close} title="新しいTodoを追加" size="md">
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
              <Button variant="default" onClick={close} disabled={submitting}>
                キャンセル
              </Button>
              <Button type="submit" loading={submitting} color="blue">
                追加
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
