'use server';

import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';
import { prisma } from '@/lib/prisma';

interface SearchPromptFormState {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
}

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
