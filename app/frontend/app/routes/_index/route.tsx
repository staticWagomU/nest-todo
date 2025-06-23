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
  IconChevronRight,
  IconChevronDown,
  IconTrash,
  IconUnlink,
} from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import {
  type Todo,
  type CreateTodoDto,
  type UpdateTodoDto,
  useTodosControllerFindAll,
  useTodosControllerCreate,
  todosControllerUpdate,
  todosControllerRemove,
  todosControllerDetachFromParent,
  useTodosControllerFindChildren,
  useTodosControllerGenerateChildTodos,
  todosControllerGenerateChildTodos,
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
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [childOpened, { open: openChild, close: closeChild }] = useDisclosure(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [parentTodoForChild, setParentTodoForChild] = useState<Todo | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

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

  const editForm = useForm<UpdateTodoDto>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      completed: false,
    },
    validate: {
      title: (value: string | undefined) =>
        !value || value.trim().length < 3 ? 'タイトルは3文字以上で入力してください' : null,
    },
  });

  const childForm = useForm<CreateTodoDto>({
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

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    editForm.setValues({
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed,
    });
    openEdit();
  };

  const handleEditSubmit = async (values: UpdateTodoDto) => {
    if (!selectedTodo) return;

    try {
      await todosControllerUpdate(selectedTodo.id, values);
      mutate(); // Revalidate todos list
      closeEdit();
      setSelectedTodo(null);
      notifications.show({
        title: '成功',
        message: 'Todoが更新されました',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'エラー',
        message: 'Todoの更新に失敗しました',
        color: 'red',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedTodo) return;

    try {
      await todosControllerRemove(selectedTodo.id);
      mutate(); // Revalidate todos list
      closeEdit();
      setSelectedTodo(null);
      notifications.show({
        title: '成功',
        message: 'Todoが削除されました',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'エラー',
        message: 'Todoの削除に失敗しました',
        color: 'red',
      });
    }
  };

  const handleCreateChild = (parentTodo: Todo) => {
    setParentTodoForChild(parentTodo);
    childForm.reset();
    openChild();
  };

  const handleChildSubmit = async (values: CreateTodoDto) => {
    if (!parentTodoForChild) return;

    try {
      await createTodoTrigger({ ...values, parentId: parentTodoForChild.id });
      childForm.reset();
      closeChild();
      setParentTodoForChild(null);
      mutate(); // Revalidate todos list
      notifications.show({
        title: '成功',
        message: '子Todoが作成されました',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'エラー',
        message: '子Todoの作成に失敗しました',
        color: 'red',
      });
    }
  };

  const handleDetach = async (todoId: string) => {
    try {
      await todosControllerDetachFromParent(todoId);
      mutate(); // Revalidate todos list
      notifications.show({
        title: '成功',
        message: 'Todoが親から切り離されました',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'エラー',
        message: 'Todoの切り離しに失敗しました',
        color: 'red',
      });
    }
  };

  const handleGenerateChildTodos = async () => {
    const title = form.getValues().title;
    const description = form.getValues().description;

    if (!title || title.trim().length < 3) {
      notifications.show({
        title: 'エラー',
        message: 'タイトルを3文字以上で入力してください',
        color: 'red',
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      // First create the parent TODO
      const parentResponse = await createTodoTrigger({
        title: title.trim(),
        description: description?.trim() || '',
        completed: false,
      });

      // Then generate child TODOs
      await todosControllerGenerateChildTodos(parentResponse.data.id);

      form.reset();
      close();
      mutate(); // Revalidate todos list
      notifications.show({
        title: '成功',
        message: 'TODOとAI子TODOが作成されました',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'エラー',
        message: 'AI TODO生成に失敗しました',
        color: 'red',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const toggleExpanded = (todoId: string) => {
    setExpandedTodos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(todoId)) {
        newSet.delete(todoId);
      } else {
        newSet.add(todoId);
      }
      return newSet;
    });
  };

  // Filter to show only parent todos (parentId is null or undefined)
  const parentTodos = todos.filter((todo: Todo) => !todo.parentId);

  // Function to render a todo with its children
  const renderTodoItem = (todo: Todo, depth = 0) => {
    const isUpdating = updatingTodos.has(todo.id);
    const hasChildren = todo.children && todo.children.length > 0;
    const isExpanded = expandedTodos.has(todo.id);
    const isChild = depth > 0;

    return (
      <div key={todo.id}>
        <Card
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            marginLeft: depth * 20,
            backgroundColor: isChild ? '#f8f9fa' : undefined,
          }}
          onClick={() => handleTodoClick(todo)}
        >
          <Group>
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(todo.id);
                }}
                style={{
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
              </button>
            )}
            <Checkbox
              checked={todo.completed}
              onChange={(event) => {
                event.stopPropagation();
                handleToggleCompleted(todo.id, event.currentTarget.checked);
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
              disabled={isUpdating}
              label={
                <Text
                  td={todo.completed ? 'line-through' : 'none'}
                  c={todo.completed ? 'dimmed' : 'inherit'}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleTodoClick(todo);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {todo.title}
                </Text>
              }
            />
            {isUpdating && <Loader size="xs" />}

            {/* Action buttons */}
            <div style={{ marginLeft: 'auto' }}>
              <Group gap="xs">
                {/* 子TODOからは子TODOを作成できない（2階層まで） */}
                {!isChild && (
                  <Button
                    size="xs"
                    variant="light"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateChild(todo);
                    }}
                  >
                    子TODO追加
                  </Button>
                )}
                {isChild && (
                  <Button
                    size="xs"
                    variant="light"
                    color="orange"
                    leftSection={<IconUnlink size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetach(todo.id);
                    }}
                  >
                    切り離し
                  </Button>
                )}
              </Group>
            </div>
          </Group>

          {todo.description && (
            <Text size="sm" c="dimmed" mt="xs" ml={hasChildren ? 20 : 0}>
              {todo.description}
            </Text>
          )}
        </Card>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>{todo.children?.map((child) => renderTodoItem(child, depth + 1))}</div>
        )}
      </div>
    );
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
            {parentTodos.length === 0 ? (
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Text ta="center" c="dimmed">
                  まだTodoがありません。新しいTodoを追加してみましょう！
                </Text>
              </Card>
            ) : (
              parentTodos.map((todo: Todo) => (
                <Suspense key={todo.id} fallback={<Loader size="sm" />}>
                  {renderTodoItem(todo)}
                </Suspense>
              ))
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
            <Group justify="space-between" gap="sm">
              <Button
                variant="filled"
                color="violet"
                onClick={handleGenerateChildTodos}
                loading={isGeneratingAI}
                disabled={isCreating}
              >
                AIで追加
              </Button>
              <Group gap="sm">
                <Button variant="default" onClick={close} disabled={isCreating || isGeneratingAI}>
                  キャンセル
                </Button>
                <Button type="submit" loading={isCreating} color="blue" disabled={isGeneratingAI}>
                  追加
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={editOpened} onClose={closeEdit} title="Todoを編集" size="md">
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack gap="md">
            <TextInput
              label="タイトル"
              placeholder="Todoのタイトルを入力してください"
              withAsterisk
              key={editForm.key('title')}
              {...editForm.getInputProps('title')}
            />
            <Textarea
              label="説明"
              placeholder="Todoの説明を入力してください（任意）"
              rows={3}
              key={editForm.key('description')}
              {...editForm.getInputProps('description')}
            />
            <Checkbox
              label="完了済み"
              key={editForm.key('completed')}
              {...editForm.getInputProps('completed', { type: 'checkbox' })}
            />
            <Group justify="space-between" gap="sm">
              <Button variant="light" color="red" onClick={handleDelete}>
                削除
              </Button>
              <Group gap="sm">
                <Button variant="default" onClick={closeEdit}>
                  キャンセル
                </Button>
                <Button type="submit" color="blue">
                  更新
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={childOpened}
        onClose={closeChild}
        title={`子Todoを追加: ${parentTodoForChild?.title}`}
        size="md"
      >
        <form onSubmit={childForm.onSubmit(handleChildSubmit)}>
          <Stack gap="md">
            <TextInput
              label="タイトル"
              placeholder="子Todoのタイトルを入力してください"
              withAsterisk
              key={childForm.key('title')}
              {...childForm.getInputProps('title')}
            />
            <Textarea
              label="説明"
              placeholder="子Todoの説明を入力してください（任意）"
              rows={3}
              key={childForm.key('description')}
              {...childForm.getInputProps('description')}
            />
            <Group justify="flex-end" gap="sm">
              <Button variant="default" onClick={closeChild} disabled={isCreating}>
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
