import { searchPromptAction } from '@/app/actions/prompt.actions';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

describe('Server Actions: Prompts', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
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
