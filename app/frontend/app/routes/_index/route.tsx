import { useState, Suspense } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import * as v from 'valibot';
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
  TodoSchema,
  createTodo,
  updateTodo,
  type Todos,
  type Todo,
  type CreateTodoRequest,
} from './loader';

export default function TodoPage() {
  // Custom fetcher with validation for todos
  const todosFetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Validate data with Valibot
    try {
      return v.parse(TodoSchema, data);
    } catch (validationError) {
      throw new Error('Invalid data format received from server');
    }
  };

  // SWR for fetching todos with validation
  const { data: todos = [], error, isLoading, mutate } = useSWR('/api/todos', todosFetcher);

  // SWR Mutations for create and update operations
  const { trigger: createTodoTrigger, isMutating: isCreating } = useSWRMutation(
    '/api/todos',
    async (url: string, { arg }: { arg: CreateTodoRequest }) => {
      const result = await createTodo(arg);
      mutate(); // Revalidate todos list
      return result;
    }
  );

  const { trigger: updateTodoTrigger } = useSWRMutation(
    '/api/todos',
    async (url: string, { arg }: { arg: { id: string; data: { completed: boolean } } }) => {
      const result = await updateTodo(arg.id, arg.data);
      mutate(); // Revalidate todos list
      return result;
    }
  );

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

  const handleSubmit = async (values: CreateTodoRequest) => {
    try {
      await createTodoTrigger(values);
      form.reset();
      close();
      notifications.show({
        title: '成功',
        message: 'Todoが作成されました',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'エラー',
        message: 'Todoの作成に失敗しました',
        color: 'red',
      });
    }
  };

  const handleToggleCompleted = async (id: string, completed: boolean) => {
    // Add to updating set
    setUpdatingTodos((prev) => new Set(prev).add(id));

    try {
      await updateTodoTrigger({ id, data: { completed } });
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
            disabled={isLoading}
          >
            Todo を追加
          </Button>
        </Group>

        {error && (
          <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />}>
            {error.message || 'An error occurred'}
          </Alert>
        )}

        {isLoading ? (
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
              <Button variant="default" onClick={close} disabled={isCreating}>
                キャンセル
              </Button>
              <Button type="submit" loading={isCreating} color="blue">
                追加
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
