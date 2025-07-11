import { Stack, TextInput, Textarea, Button, Group, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';

export interface TodoFormData {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TodoFormProps {
  initialValues?: TodoFormData;
  onSubmit: (values: TodoFormData) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showCompleted?: boolean;
  showAiButton?: boolean;
  onAiGenerate?: () => void;
  isAiLoading?: boolean;
}

export function TodoForm({
  initialValues = { title: '', description: '', completed: false },
  onSubmit,
  onCancel,
  submitText = '追加',
  cancelText = 'キャンセル',
  isLoading = false,
  showCompleted = false,
  showAiButton = false,
  onAiGenerate,
  isAiLoading = false,
}: TodoFormProps) {
  const form = useForm<TodoFormData>({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      title: (value: string) =>
        value.trim().length < 3 ? 'タイトルは3文字以上で入力してください' : null,
    },
  });

  const handleSubmit = (values: TodoFormData) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="タイトル"
          placeholder="TODOのタイトルを入力してください"
          withAsterisk
          key={form.key('title')}
          {...form.getInputProps('title')}
        />
        <Textarea
          label="説明"
          placeholder="TODOの説明を入力してください（任意）"
          rows={3}
          key={form.key('description')}
          {...form.getInputProps('description')}
        />
        {showCompleted && (
          <Checkbox
            label="完了済み"
            key={form.key('completed')}
            {...form.getInputProps('completed', { type: 'checkbox' })}
          />
        )}
        <Group justify={showAiButton ? 'space-between' : 'flex-end'} gap="sm">
          {showAiButton && (
            <Button
              variant="filled"
              color="violet"
              onClick={onAiGenerate}
              loading={isAiLoading}
              disabled={isLoading}
            >
              AIで追加
            </Button>
          )}
          <Group gap="sm">
            {onCancel && (
              <Button variant="default" onClick={onCancel} disabled={isLoading || isAiLoading}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" loading={isLoading} color="blue" disabled={isAiLoading}>
              {submitText}
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
