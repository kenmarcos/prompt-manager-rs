import { PromptForm } from '@/components/prompts';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const createActionMock = jest.fn();
jest.mock('@/app/actions/prompt.actions', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const makeSut = () => {
  return render(<PromptForm />);
};

describe('PromptForm', () => {
  beforeEach(() => {
    createActionMock.mockReset();
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
});
