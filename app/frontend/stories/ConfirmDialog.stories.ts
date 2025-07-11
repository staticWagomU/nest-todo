import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ConfirmDialog } from '../app/components/ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    opened: {
      control: { type: 'boolean' },
      description: 'ダイアログが開いているか',
    },
    title: {
      control: { type: 'text' },
      description: 'ダイアログのタイトル',
    },
    message: {
      control: { type: 'text' },
      description: 'メッセージ内容',
    },
    confirmText: {
      control: { type: 'text' },
      description: '確認ボタンのテキスト',
    },
    cancelText: {
      control: { type: 'text' },
      description: 'キャンセルボタンのテキスト',
    },
    confirmColor: {
      control: { type: 'select' },
      options: ['blue', 'red', 'green', 'orange', 'violet'],
      description: '確認ボタンの色',
    },
    loading: {
      control: { type: 'boolean' },
      description: '処理中の状態',
    },
  },
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    opened: true,
    title: '確認',
    message: 'この操作を実行しますか？',
  },
};

export const DeleteConfirmation: Story = {
  args: {
    opened: true,
    title: '削除の確認',
    message: '「サンプルTODO」を削除しますか？',
    confirmText: '削除',
    confirmColor: 'red',
  },
};

export const WithWarning: Story = {
  args: {
    opened: true,
    title: '削除の確認',
    message: '「親TODO」を削除しますか？',
    confirmText: '削除',
    confirmColor: 'red',
    warning: {
      title: '子TODOが存在します',
      message: 'この親TODOには 3 個の子TODOがあります。削除すると子TODOも一緒に削除されます。',
      color: 'orange',
    },
  },
};

export const WithAdditionalButtons: Story = {
  args: {
    opened: true,
    title: '削除の確認',
    message: '「親TODO」を削除しますか？',
    confirmText: '子TODOも削除する',
    confirmColor: 'red',
    warning: {
      title: '子TODOが存在します',
      message: 'この親TODOには 2 個の子TODOがあります。どのように処理しますか？',
      color: 'orange',
    },
    additionalButtons: [
      {
        text: '子TODOを切り離す',
        color: 'orange',
        onClick: fn(),
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    opened: true,
    title: '削除中',
    message: 'TODOを削除しています...',
    confirmText: '削除',
    confirmColor: 'red',
    loading: true,
  },
};

export const LongContent: Story = {
  args: {
    opened: true,
    title: '重要な確認',
    message:
      'これは非常に長いメッセージです。この操作は取り消すことができません。本当に実行してもよろしいですか？この操作により、関連するすべてのデータが削除されます。',
    confirmText: '実行',
    confirmColor: 'red',
    warning: {
      title: '警告: データの完全削除',
      message:
        'この操作により以下のデータが完全に削除されます：\n• メインのTODOアイテム\n• 関連する子TODOアイテム（15個）\n• 添付ファイル（3個）\n• コメント履歴\n\nこの操作は取り消すことができません。',
      color: 'red',
    },
  },
};
