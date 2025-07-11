import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SortControl } from '../app/components/SortControl';

const meta: Meta<typeof SortControl> = {
  title: 'Components/SortControl',
  component: SortControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'select' },
      options: ['asc', 'desc'],
      description: '現在の並び順',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'コンポーネントを無効化するか',
    },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Ascending: Story = {
  args: {
    value: 'asc',
  },
};

export const Descending: Story = {
  args: {
    value: 'desc',
  },
};

export const Disabled: Story = {
  args: {
    value: 'desc',
    disabled: true,
  },
};
