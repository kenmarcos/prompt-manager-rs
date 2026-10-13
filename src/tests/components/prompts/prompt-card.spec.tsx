import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card';
import { render, screen } from '@/lib/test-utils';

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
});
