import { act, render, screen, waitFor } from '@/lib/test-utils';
import {
  CopyButton,
  type CopyButtonProps,
} from '@/components/button-actions/copy-button';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const writeTextMock = jest.fn();

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}));

const makeSut = ({ content = '' }: CopyButtonProps = {} as CopyButtonProps) => {
  return render(<CopyButton content={content} />);
};

describe('CopyButton', () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeEach(() => {
    writeTextMock.mockReset();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  it('deve desabilitar o botão quando o conteúdo estiver vazio', async () => {
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText');

    makeSut();

    const button = screen.getByRole('button', { name: /copiar/i });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(writeTextSpy).not.toHaveBeenCalled();
  });

  it('deve copiar e alterar o label para "Copiado" e voltar para "Copiar"', async () => {
    writeTextMock.mockResolvedValue(undefined);

    const content = 'content to copy';
    makeSut({ content: content });

    const button = screen.getByRole('button', { name: /copiar/i });

    expect(button).not.toBeDisabled();

    await user.click(button);

    expect(
      await screen.findByRole('button', { name: /copiado/i })
    ).toBeVisible();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(
      await screen.findByRole('button', { name: /copiar/i })
    ).toBeVisible();
  });

  it('deve exibir um toast de erro quando o copiar falhar', async () => {
    const errorMessage = 'falha ao copiar';
    const error = new Error(errorMessage);

    jest
      .spyOn(global.navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(error);

    const content = 'content to copy';
    makeSut({ content: content });

    const button = screen.getByRole('button', { name: /copiar/i });

    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `Error ao copiar o texto: ${errorMessage}`
      );
    });

    expect(screen.getByRole('button', { name: /copiar/i })).toBeVisible();
  });

  it('deve limpar o timer anterior antes de copiar novamente', async () => {
    writeTextMock.mockResolvedValue(undefined);

    const clearSpy = jest.spyOn(window, 'clearTimeout');

    const content = 'content to copy';
    makeSut({ content: content });

    const button = screen.getByRole('button', { name: /copiar/i });

    await user.click(button);

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /copiado/i })
      ).toBeInTheDocument()
    );

    await user.click(screen.getByRole('button', { name: /copiado/i }));

    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
  });
});
