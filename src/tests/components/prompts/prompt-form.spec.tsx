import { PromptForm } from '@/components/prompts';
import { Prompt } from '@/generated/prisma/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const createActionMock = jest.fn();
const updateActionMock = jest.fn();
jest.mock('@/app/actions/prompt.actions', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),

  updatePromptAction: (...args: unknown[]) => updateActionMock(...args),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const makeSut = (prompt: Prompt | null = null) => {
  return render(<PromptForm prompt={prompt} />);
};

describe('PromptForm', () => {
  beforeEach(() => {
    createActionMock.mockReset();
    updateActionMock.mockReset();
    refreshMock.mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
  });

  it('should create a new prompt successfully', async () => {
    const successMessage = 'success';
    createActionMock.mockResolvedValueOnce({
      success: true,
      message: successMessage,
    });
    makeSut();

    const titleField = screen.getByPlaceholderText(/título do prompt/i);
    const contentField = screen.getByPlaceholderText(
      /digite o conteúdo do seu prompt aqui.../i
    );

    const titleText = 'My Prompt Title';
    const contentText = 'This is the content of my prompt.';

    await userEvent.type(titleField, titleText);
    await userEvent.type(contentField, contentText);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(submitButton);

    expect(createActionMock).toHaveBeenCalledWith({
      title: titleText,
      content: contentText,
    });
    expect(toast.success).toHaveBeenCalledWith(successMessage);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('should show an error message when prompt creation fails', async () => {
    const errorMessage = 'error';
    createActionMock.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    });
    makeSut();

    const titleField = screen.getByPlaceholderText(/título do prompt/i);
    const contentField = screen.getByPlaceholderText(
      /digite o conteúdo do seu prompt aqui.../i
    );

    const titleText = 'My Prompt Title';
    const contentText = 'This is the content of my prompt.';

    await userEvent.type(titleField, titleText);
    await userEvent.type(contentField, contentText);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('deve exibir as mensagens de erro quando o formulário estiver vazio', async () => {
    makeSut();

    const submitButton = screen.getByRole('button', { name: /salvar/i });

    await userEvent.click(submitButton);

    expect(screen.getByText('O título é obrigatório')).toBeVisible();
    expect(screen.getByText('O conteúdo é obrigatório')).toBeVisible();

    expect(createActionMock).not.toHaveBeenCalled();
  });

  it('deve atualizar um prompt existente, com sucesso', async () => {
    const successMessage = 'success';

    updateActionMock.mockResolvedValueOnce({
      success: true,
      message: successMessage,
    });

    const now = new Date();
    const prompt: Prompt = {
      id: '1',
      title: 'old title',
      content: 'old content',
      createdAt: now,
      updatedAt: now,
    };

    const newTitle = 'new title';
    const newContent = 'new content';

    makeSut(prompt);

    const titleField = screen.getByPlaceholderText(/título do prompt/i);
    await userEvent.clear(titleField);
    await userEvent.type(titleField, newTitle);

    const contentField = screen.getByPlaceholderText(
      /digite o conteúdo do seu prompt aqui.../i
    );
    await userEvent.clear(contentField);
    await userEvent.type(contentField, newContent);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(submitButton);

    expect(updateActionMock).toHaveBeenCalledWith({
      id: prompt.id,
      title: newTitle,
      content: newContent,
    });
    expect(toast.success).toHaveBeenCalledWith(successMessage);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
