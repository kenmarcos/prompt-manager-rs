'use client';

import {
  CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError } from '../ui/field';
import {
  createPromptAction,
  updatePromptAction,
} from '@/app/actions/prompt.actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CopyButton } from '../button-actions';
import { Prompt } from '@/generated/prisma/client';

interface PromptFormProps {
  prompt?: Prompt | null;
}

export const PromptForm = ({ prompt }: PromptFormProps) => {
  const router = useRouter();

  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: prompt?.title || '',
      content: prompt?.content || '',
    },
  });

  const content = useWatch({
    control: form.control,
    name: 'content',
  });

  const isEdit = !!prompt?.id;

  const handleSubmitForm = async (data: CreatePromptDTO) => {
    const result = isEdit
      ? await updatePromptAction({
          id: prompt.id,
          ...data,
        })
      : await createPromptAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <CopyButton content={content} />

        <Button type="submit" size="sm">
          Salvar
        </Button>
      </header>

      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              placeholder="Título do prompt"
              variant="transparent"
              size="lg"
              autoFocus
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Textarea
              placeholder="Digite o conteúdo do seu prompt aqui..."
              variant="transparent"
              size="lg"
              {...field}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};
