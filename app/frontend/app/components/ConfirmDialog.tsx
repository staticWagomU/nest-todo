import { Modal, Stack, Text, Button, Group, Alert } from '@mantine/core';

export interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  warning?: {
    title: string;
    message: string;
    color?: string;
  };
  additionalButtons?: Array<{
    text: string;
    color?: string;
    onClick: () => void;
  }>;
  loading?: boolean;
}

export function ConfirmDialog({
  opened,
  onClose,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  confirmColor = 'blue',
  onConfirm,
  warning,
  additionalButtons = [],
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size="md">
      <Stack gap="md">
        <Text>{message}</Text>

        {warning && (
          <Alert color={warning.color || 'orange'} title={warning.title}>
            {warning.message}
          </Alert>
        )}

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>

          {additionalButtons.map((button) => (
            <Button
              key={button.text}
              color={button.color}
              onClick={button.onClick}
              disabled={loading}
            >
              {button.text}
            </Button>
          ))}

          <Button color={confirmColor} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
