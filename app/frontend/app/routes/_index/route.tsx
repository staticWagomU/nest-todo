import { useState, Suspense, useEffect, useCallback } from 'react';
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
  SegmentedControl,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconPlus,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import {
  type Todo,
  type CreateTodoDto,
  type UpdateTodoDto,
  useTodosControllerFindAll,
  useTodosControllerCreate,
  todosControllerUpdate,
} from './loader';

export default function TodoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderParam = searchParams.get('order');

  // URLパラメータをlowercaseに変換（DESC → desc, ASC → asc）
  const normalizeOrder = useCallback((order: string | null): 'asc' | 'desc' => {
    if (order?.toUpperCase() === 'ASC') return 'asc';
    if (order?.toUpperCase() === 'DESC') return 'desc';
    return 'desc'; // デフォルト
  }, []);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(normalizeOrder(orderParam));

  // 初回ロード時にURLパラメータがない場合はデフォルト値を設定
  useEffect(() => {
    if (!orderParam) {
      setSearchParams({ order: 'DESC' });
    }
  }, [orderParam, setSearchParams]);

  // URLパラメータの変更を監視
  useEffect(() => {
    const newOrder = normalizeOrder(orderParam);
    if (newOrder !== sortOrder) {
      setSortOrder(newOrder);
    }
  }, [orderParam, sortOrder, normalizeOrder]);

  // Use generated SWR hooks for data fetching
  const {
    data: todosResponse,
    error,
    isLoading,
    mutate,
  } = useTodosControllerFindAll({ order: sortOrder });
  const todos = todosResponse?.data || [];

  // Use generated SWR mutation hooks
  const { trigger: createTodoTrigger, isMutating: isCreating } = useTodosControllerCreate({
    swr: {
      onSuccess: () => {
        mutate(); // Revalidate todos list
      },
    },
  });

  const [updatingTodos, setUpdatingTodos] = useState<Set<string>>(new Set());
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<CreateTodoDto>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      completed: false,
    },
    validate: {
      title: (value: string) =>
        value.trim().length < 3 ? 'タイトルは3文字以上で入力してください' : null,
    },
  });

  const handleSubmit = async (values: CreateTodoDto) => {
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
      await todosControllerUpdate(id, { completed });
      mutate(); // Revalidate todos list
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
          <Group gap="sm">
            <SegmentedControl
              value={sortOrder}
              onChange={(value: string) => {
                const newOrder = value as 'asc' | 'desc';
                setSortOrder(newOrder);
                setSearchParams({ order: newOrder.toUpperCase() });
              }}
              data={[
                {
                  label: (
                    <Group gap={4}>
                      <IconSortAscending size={16} />
                      <Text size="sm">古い順</Text>
                    </Group>
                  ),
                  value: 'asc',
                },
                {
                  label: (
                    <Group gap={4}>
                      <IconSortDescending size={16} />
                      <Text size="sm">新しい順</Text>
                    </Group>
                  ),
                  value: 'desc',
                },
              ]}
            />
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
