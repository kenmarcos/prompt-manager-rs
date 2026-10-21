import {
  createPromptAction,
  searchPromptAction,
  updatePromptAction,
} from '@/app/actions/prompt.actions';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

jest.mock('@/core/application/prompts/create-prompt.use-case', () => ({
  CreatePromptsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.mock('@/core/application/prompts/update-prompt.use-case', () => ({
  UpdatePromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedUpdateExecute })),
}));

describe('Server Actions: Prompts', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
  });

  describe('createPromptAction', () => {
    it('should create a new prompt successfully', async () => {
      mockedCreateExecute.mockResolvedValue(undefined);

      const data = {
        title: 'New Prompt',
        content: 'This is a new prompt.',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe('Prompt criado com sucesso');
    });

    it('should return validation error when the fields are empty', async () => {
      const data = {
        title: '',
        content: '',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Erro de validação');
      expect(result?.errors).toBeDefined();
    });

    it('should return error when the prompt already exists', async () => {
      mockedCreateExecute.mockRejectedValue(new Error('PROMPT_ALREADY_EXISTS'));

      const data = {
        title: 'duplicated',
        content: 'duplicated',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Este prompt já existe');
    });

    it('should return a generic error when the creation fails', async () => {
      mockedCreateExecute.mockRejectedValue(new Error('UNKNOWN'));

      const data = {
        title: 'error',
        content: 'error',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Falha ao criar o prompt');
    });
  });

  describe('updatePromptAction', () => {
    it('deve atualizar um prompt com sucesso', async () => {
      // mockedUpdateExecute.mockResolvedValue({});

      const data = {
        id: '1',
        title: 'new title',
        content: 'new content',
      };

      const result = await updatePromptAction(data);

      expect(result).toEqual({
        success: true,
        message: 'Prompt atualizado com sucesso',
      });
    });

    it('deve retornar erro de validação quando os campos faltarem', async () => {
      const data = {
        id: '1',
        title: '',
        content: '',
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro de validação');
      expect(result.errors).toBeDefined();
    });

    it('deve retornar erro quando o prompt não existir', async () => {
      mockedUpdateExecute.mockRejectedValue(new Error('PROMPT_NOT_FOUND'));
      const data = {
        id: '1',
        title: 'title',
        content: 'content',
      };

      const result = await updatePromptAction(data);

      expect(result).toEqual({
        success: false,
        message: 'Prompt não encontrado',
      });
    });

    it('deve retornar o erro genérico quando falhar ao atualizar', async () => {
      mockedUpdateExecute.mockRejectedValue(new Error());

      const data = {
        id: '1',
        title: 'title',
        content: 'content',
      };

      const result = await updatePromptAction(data);

      expect(result).toEqual({
        success: false,
        message: 'Falha ao atualizar o prompt',
      });
    });
  });

  describe('searchPromptAction', () => {
    it('should return success when the search term not empty', async () => {
      const input = [{ id: '1', title: 'AI title', content: 'Content' }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', 'AI');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should return success and list all prompts when the search term is empty', async () => {
      const input = [
        { id: '1', title: 'First', content: 'Content 01' },
        { id: '2', title: 'Second', content: 'Content 02' },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.prompts).toHaveLength(input.length);
      expect(result.prompts).toEqual(input);
    });

    it('should return a generic error when the search fails', async () => {
      const error = new Error('UNKNOWN');

      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append('q', 'error test');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBe(undefined);
      expect(result.message).toMatch(/falha ao buscar prompts\./i);
    });

    it('should trim spaces from the term before executing', async () => {
      const input = [{ id: '1', title: 'AI title', content: 'Content' }];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '   AI  ');

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('AI');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should treat a missing query as an empty search term', async () => {
      const input = [
        { id: '1', title: 'First title', content: 'Content 01' },
        { id: '2', title: 'Second title', content: 'Content 02' },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });
});
