import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const deleteMock = jest.fn();
jest.mock('@/app/actions/prompt.actions', () => {
  return {
    deletePromptAction: (id: string) => deleteMock(id),
  };
});

jest.mock('sonner', () => {
  return {
    toast: {
      success: jest.fn(),
    },
  };
});

const makeSut = ({ prompt }: PromptCardProps = {} as PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

describe('PromptCard', () => {
  it('deve renderizar o link com href corretamente', () => {
    const prompt = {
      id: '1',
      title: 'title 01',
      content: 'content 01',
    };

    makeSut({ prompt });

    const link = screen.getByRole('link');

    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', `/${prompt.id}`);
  });

  it('deve abrir o dialog de remoção de um prompt', async () => {
    const prompt = {
      id: '1',
      title: 'title 01',
      content: 'content 01',
    };

    makeSut({ prompt });

    const openDialogButton = screen.getByRole('button', {
      name: 'Remover Prompt',
    });

    await userEvent.click(openDialogButton);

    expect(screen.getByText('Remover Prompt')).toBeVisible();
  });

  it('deve remover com sucesso e exibir o toast', async () => {
    deleteMock.mockResolvedValue({
      success: true,
      message: 'Prompt removido com sucesso!',
    });

    const prompt = {
      id: '1',
      title: 'title 01',
      content: 'content 01',
    };

    makeSut({ prompt });

    const openDialogButton = screen.getByRole('button', {
      name: 'Remover Prompt',
    });

    await userEvent.click(openDialogButton);

    const deleteButton = screen.getByRole('button', { name: 'Remover' });

    await userEvent.click(deleteButton);

    expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso!');
  });
});
