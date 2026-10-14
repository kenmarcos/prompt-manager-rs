import { CreatePromptsUseCase } from '@/core/application/prompts/create-prompt.use-case';
import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    create: jest.fn(),
  };

  return { ...base, ...overrides } as PromptRepository;
};

describe('CreatePromptUseCase', () => {
  it('deve criar um prompt quando não existir duplicidade', async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue(null),
    });

    const useCase = new CreatePromptsUseCase(repository);

    const data = {
      title: 'title',
      content: 'content',
    };

    await expect(useCase.execute(data)).resolves.toBeUndefined();

    expect(repository.create).toHaveBeenCalled();
  });

  it('deve falhar com PROMPT_ALREADY_EXISTS quando o título já existe', async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue({
        id: 'id',
        title: 'title',
        content: 'content',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    const useCase = new CreatePromptsUseCase(repository);

    const data = {
      title: 'title',
      content: 'content',
    };

    await expect(useCase.execute(data)).rejects.toThrow(
      new Error('PROMPT_ALREADY_EXISTS')
    );
  });
});
