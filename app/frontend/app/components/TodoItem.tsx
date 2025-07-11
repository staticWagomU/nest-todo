import { Card, Checkbox, Text, Group, Button, Loader } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconUnlink } from '@tabler/icons-react';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  children?: Todo[];
  parentId?: string;
}

export interface TodoItemProps {
  todo: Todo;
  depth?: number;
  isUpdating?: boolean;
  isExpanded?: boolean;
  onToggleCompleted?: (id: string, completed: boolean) => void;
  onToggleExpanded?: (id: string) => void;
  onClick?: (todo: Todo) => void;
  onCreateChild?: (todo: Todo) => void;
  onDetach?: (id: string) => void;
}

export function TodoItem({
  todo,
  depth = 0,
  isUpdating = false,
  isExpanded = false,
  onToggleCompleted,
  onToggleExpanded,
  onClick,
  onCreateChild,
  onDetach,
}: TodoItemProps) {
  const hasChildren = todo.children && todo.children.length > 0;
  const isChild = depth > 0;

  return (
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
      onClick={() => onClick?.(todo)}
    >
      <Group>
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded?.(todo.id);
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
            onToggleCompleted?.(todo.id, event.currentTarget.checked);
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
                onClick?.(todo);
              }}
              style={{ cursor: 'pointer' }}
            >
              {todo.title}
            </Text>
          }
        />
        {isUpdating && <Loader size="xs" />}

        <div style={{ marginLeft: 'auto' }}>
          <Group gap="xs">
            {!isChild && (
              <Button
                size="xs"
                variant="light"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateChild?.(todo);
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
                  onDetach?.(todo.id);
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

      {todo.createdAt && (
        <Text size="xs" c="dimmed" mt="xs" ml={hasChildren ? 20 : 0}>
          作成日時: {new Date(todo.createdAt).toLocaleString('ja-JP')}
        </Text>
      )}
    </Card>
  );
}
