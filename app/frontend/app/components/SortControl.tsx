import { SegmentedControl, Group, Text } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';

export interface SortControlProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
  disabled?: boolean;
}

export function SortControl({ value, onChange, disabled = false }: SortControlProps) {
  return (
    <SegmentedControl
      value={value}
      onChange={onChange}
      disabled={disabled}
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
  );
}
