import { UpdatePromptDTO } from '@/core/application/prompts/update-prompt.dto';
import { UpdatePromptUseCase } from '@/core/application/prompts/update-prompt.use-case';
import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    update: jest.fn(async (id, data) => {
      return {
        id,
        title: data.title ?? '',
        content: data.content ?? '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

    findById: jest.fn(async () => {
      return null;
    }),
  };

  return { ...base, ...overrides } as PromptRepository;
};

describe('UpdatePromptUseCase', () => {
  it('deve atualizar quando o prompt existir', async () => {
    const now = new Date();
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue({
        id: '1',
        title: 'old title',
        content: 'old content',
        createdAt: now,
        updatedAt: now,
      }),

      update: jest.fn().mockResolvedValue({
        id: '1',
        title: 'new title',
        content: 'new content',
        createdAt: now,
        updatedAt: now,
      }),
    });

    const useCase = new UpdatePromptUseCase(repository);

    const data: UpdatePromptDTO = {
      id: '1',
      title: 'new title',
      content: 'new content',
    };

    const result = await useCase.execute(data);

    expect(result.title).toBe(data.title);
    expect(repository.update).toHaveBeenCalledWith(data.id, {
      title: data.title,
      content: data.content,
    });
  });

  it('deve falhar com PROMPT_NOT_FOUND quando o prompt não existir', async () => {
    const repository = makeRepository({
      // findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = new UpdatePromptUseCase(repository);

    const data: UpdatePromptDTO = {
      id: '1',
      title: 'title',
      content: 'content',
    };

    await expect(useCase.execute(data)).rejects.toThrow(
      new Error('PROMPT_NOT_FOUND')
    );
  });
});
