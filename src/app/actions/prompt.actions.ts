'use server';

import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';
import { prisma } from '@/lib/prisma';
import {
  CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';
import z from 'zod';
import { CreatePromptsUseCase } from '@/core/application/prompts/create-prompt.use-case';
import {
  UpdatePromptDTO,
  updatePromptSchema,
} from '@/core/application/prompts/update-prompt.dto';
import { UpdatePromptUseCase } from '@/core/application/prompts/update-prompt.use-case';
import { DeletePromptUseCase } from '@/core/application/prompts/delete-prompt.use-case';
import { revalidatePath } from 'next/cache';

interface SearchPromptFormState {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
}

interface FormState {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
  errors?: unknown;
}

export const createPromptAction = async (
  data: CreatePromptDTO
): Promise<FormState> => {
  const validated = createPromptSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);

    return {
      success: false,
      message: 'Erro de validação',
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new CreatePromptsUseCase(repository);

    await useCase.execute(validated.data);

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Prompt criado com sucesso',
    };
  } catch (error) {
    const _error = error as Error;

    if (_error.message === 'PROMPT_ALREADY_EXISTS') {
      return {
        success: false,
        message: 'Este prompt já existe',
      };
    }

    return {
      success: false,
      message: 'Falha ao criar o prompt',
    };
  }
};

export const searchPromptAction = async (
  _prevState: SearchPromptFormState,
  formData: FormData
): Promise<SearchPromptFormState> => {
  const term = String(formData.get('q') ?? '').trim();

  const repository = new PrismaPromptRepository(prisma);
  const useCase = new SearchPromptsUseCase(repository);

  try {
    const results = await useCase.execute(term);

    const prompts = results.map(({ id, title, content }) => {
      return {
        id,
        title,
        content,
      };
    });

    return {
      success: true,
      prompts: prompts,
    };
  } catch {
    return {
      success: false,
      message: 'Falha ao buscar prompts.',
    };
  }
};

export const updatePromptAction = async (
  data: UpdatePromptDTO
): Promise<FormState> => {
  const validated = updatePromptSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);

    return {
      success: false,
      message: 'Erro de validação',
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new UpdatePromptUseCase(repository);

    await useCase.execute(validated.data);

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Prompt atualizado com sucesso',
    };
  } catch (error) {
    const _error = error as Error;
    if (_error.message === 'PROMPT_NOT_FOUND') {
      return {
        success: false,
        message: 'Prompt não encontrado',
      };
    }

    return {
      success: false,
      message: 'Falha ao atualizar o prompt',
    };
  }
};

export const deletePromptAction = async (id: string): Promise<FormState> => {
  if (!id) {
    return {
      success: false,
      message: 'Id do prompt é obrigatório',
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new DeletePromptUseCase(repository);

    await useCase.execute(id);

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Prompt removido com sucesso',
    };
  } catch (error) {
    const _error = error as Error;
    if (_error.message === 'PROMPT_NOT_FOUND') {
      return {
        success: false,
        message: 'Prompt não encontrado',
      };
    }

    return {
      success: false,
      message: 'Falha ao remover o prompt',
    };
  }
};
