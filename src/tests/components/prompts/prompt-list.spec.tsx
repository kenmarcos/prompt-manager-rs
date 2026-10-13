import { PromptList, type PromptListProps } from '@/components/prompts';
import { render, screen } from '@/lib/test-utils';

const makeSut = ({ prompts = [] }: PromptListProps = {} as PromptListProps) => {
  return render(<PromptList prompts={prompts} />);
};

describe('PromptList', () => {
  it('deve renderizar lista com os prompts', () => {
    const prompts = [
      {
        id: '1',
        title: 'A',
        content: 'X',
      },
      {
        id: '2',
        title: 'B',
        content: 'Y',
      },
    ];

    makeSut({ prompts: prompts });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('A')).toBeVisible();
    expect(screen.getByText('B')).toBeVisible();
  });

  it('deve renderizar lista vazia quando não houver prompts', () => {
    makeSut();

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
