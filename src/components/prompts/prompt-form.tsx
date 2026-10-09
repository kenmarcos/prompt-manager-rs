'use client';

import {
  CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError } from '../ui/field';
import { createPromptAction } from '@/app/actions/prompt.actions';
import { useRouter } from 'next/navigation';

export const PromptForm = () => {
  const router = useRouter();

  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const handleSubmitForm = async (data: CreatePromptDTO) => {
    const result = await createPromptAction(data);
    console.log('result', result);

    if (!result.success) {
      return;
    }

    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
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
