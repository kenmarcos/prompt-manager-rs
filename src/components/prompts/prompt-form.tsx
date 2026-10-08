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
import { Field } from '../ui/field';

export const PromptForm = () => {
  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  return (
    <form className="space-y-6">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <Button type="submit" size="sm">
          Salvar
        </Button>
      </header>

      <Controller
        name="title"
        control={form.control}
        render={({ field }) => (
          <Field>
            <Input
              placeholder="Título do prompt"
              variant="transparent"
              size="lg"
              autoFocus
              {...field}
            />
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field }) => (
          <Field>
            <Textarea
              placeholder="Digite o conteúdo do seu prompt aqui..."
              variant="transparent"
              size="lg"
              {...field}
            />
          </Field>
        )}
      />
    </form>
  );
};
