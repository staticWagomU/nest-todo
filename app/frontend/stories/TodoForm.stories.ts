import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TodoForm } from '../app/components/TodoForm';

const meta: Meta<typeof TodoForm> = {
  title: 'Components/TodoForm',
  component: TodoForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    submitText: {
      control: { type: 'text' },
      description: '送信ボタンのテキスト',
    },
    cancelText: {
      control: { type: 'text' },
      description: 'キャンセルボタンのテキスト',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: '送信処理中の状態',
    },
    showCompleted: {
      control: { type: 'boolean' },
      description: '完了チェックボックスを表示するか',
    },
    showAiButton: {
      control: { type: 'boolean' },
      description: 'AIボタンを表示するか',
    },
    isAiLoading: {
      control: { type: 'boolean' },
      description: 'AI処理中の状態',
    },
  },
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    onAiGenerate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CreateTodo: Story = {
  args: {
    submitText: '追加',
    showAiButton: true,
  },
};

export const EditTodo: Story = {
  args: {
    initialValues: {
      title: '既存のTODO',
      description: '編集するTODOの説明',
      completed: false,
    },
    submitText: '更新',
    showCompleted: true,
  },
};

export const CompletedTodo: Story = {
  args: {
    initialValues: {
      title: '完了済みTODO',
      description: '完了済みのTODOを編集',
      completed: true,
    },
    submitText: '更新',
    showCompleted: true,
  },
};

export const Loading: Story = {
  args: {
    submitText: '追加中...',
    isLoading: true,
  },
};

export const AiLoading: Story = {
  args: {
    submitText: '追加',
    showAiButton: true,
    isAiLoading: true,
  },
};

export const WithoutCancel: Story = {
  args: {
    submitText: '保存',
    onCancel: undefined,
  },
};

export const ChildTodoForm: Story = {
  args: {
    submitText: '子TODO追加',
    cancelText: '戻る',
  },
};

export const LongContent: Story = {
  args: {
    initialValues: {
      title:
        'とても長いタイトルのTODOアイテムです。これは改行やレイアウトをテストするためのサンプルです。',
      description:
        'これも非常に長い説明文です。複数行にわたって表示されることを確認するためのテストケースとして使用します。実際のアプリケーションでは、このような長いテキストが入力される可能性があります。\n\nさらに改行を含む場合もあります。\n\n- リスト項目1\n- リスト項目2\n- リスト項目3',
      completed: false,
    },
    submitText: '更新',
    showCompleted: true,
  },
};
