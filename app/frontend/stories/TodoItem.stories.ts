import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TodoItem, type Todo } from '../app/components/TodoItem';

const sampleTodo: Todo = {
  id: '1',
  title: 'サンプルTODO',
  description: 'これはサンプルのTODOアイテムです。説明文が含まれています。',
  completed: false,
  createdAt: '2024-06-25T10:00:00Z',
};

const completedTodo: Todo = {
  id: '2',
  title: '完了済みTODO',
  description: 'これは完了済みのTODOです。',
  completed: true,
  createdAt: '2024-06-24T15:30:00Z',
};

const todoWithChildren: Todo = {
  id: '3',
  title: '親TODO',
  description: '子TODOを持つ親TODOです。',
  completed: false,
  createdAt: '2024-06-23T09:15:00Z',
  children: [
    {
      id: '4',
      title: '子TODO 1',
      description: '最初の子TODO',
      completed: false,
      createdAt: '2024-06-23T09:20:00Z',
      parentId: '3',
    },
    {
      id: '5',
      title: '子TODO 2',
      description: '2番目の子TODO',
      completed: true,
      createdAt: '2024-06-23T09:25:00Z',
      parentId: '3',
    },
  ],
};

const childTodo: Todo = {
  id: '6',
  title: '子TODO',
  description: '親から独立した子TODO',
  completed: false,
  createdAt: '2024-06-22T14:00:00Z',
  parentId: '7',
};

const meta: Meta<typeof TodoItem> = {
  title: 'Components/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    depth: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'ネストの深さを指定します（0が最上位）',
    },
    isUpdating: {
      control: { type: 'boolean' },
      description: '更新中の状態を表示するかどうか',
    },
    isExpanded: {
      control: { type: 'boolean' },
      description: '子TODOが展開されているかどうか',
    },
  },
  args: {
    onToggleCompleted: fn(),
    onToggleExpanded: fn(),
    onClick: fn(),
    onCreateChild: fn(),
    onDetach: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    todo: sampleTodo,
  },
};

export const Completed: Story = {
  args: {
    todo: completedTodo,
  },
};

export const WithChildren: Story = {
  args: {
    todo: todoWithChildren,
    isExpanded: false,
  },
};

export const WithChildrenExpanded: Story = {
  args: {
    todo: todoWithChildren,
    isExpanded: true,
  },
};

export const ChildTodo: Story = {
  args: {
    todo: childTodo,
    depth: 1,
  },
};

export const Updating: Story = {
  args: {
    todo: sampleTodo,
    isUpdating: true,
  },
};

export const NoDescription: Story = {
  args: {
    todo: {
      id: '8',
      title: '説明なしTODO',
      completed: false,
      createdAt: '2024-06-25T12:00:00Z',
    },
  },
};

export const LongTitle: Story = {
  args: {
    todo: {
      id: '9',
      title:
        'とても長いタイトルのTODOアイテムです。これは改行やレイアウトをテストするためのサンプルです。',
      description:
        'これも非常に長い説明文です。複数行にわたって表示されることを確認するためのテストケースとして使用します。実際のアプリケーションでは、このような長いテキストが入力される可能性があります。',
      completed: false,
      createdAt: '2024-06-25T08:30:00Z',
    },
  },
};

export const Interactive: Story = {
  args: {
    todo: sampleTodo,
  },
  play: async ({ canvasElement, args }) => {
    // インタラクティブなテストは必要に応じて追加
  },
};
