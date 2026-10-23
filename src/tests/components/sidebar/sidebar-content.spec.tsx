import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/sidebar/sidebar-content';
import { render, screen, waitFor } from '@/lib/test-utils';
import { userEvent } from '@testing-library/user-event';

const pushMock = jest.fn();

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: pushMock,
    }),
    useSearchParams: () => mockSearchParams,
  };
});

const initialPrompts = [
  {
    id: '1',
    title: 'Title 1',
    content: 'Content 1',
  },
];

// fabricar o SUT (System Under Test)
const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe('SidebarContent', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    pushMock.mockClear();
  });

  it('should render the sidebar content', () => {
    makeSut();

    const header = screen.getByRole('banner', { name: /título do sidebar/i });

    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/prompts/i);
    expect(
      screen.getByRole('button', { name: /novo prompt/i })
    ).toBeInTheDocument();
  });

  it('should redirect to the correct page when clicking the New Prompt button', async () => {
    makeSut();

    const button = screen.getByRole('button', { name: /novo prompt/i });

    await userEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith('/new');
  });

  it('should render the sidebar expanded by default', async () => {
    makeSut();

    const sidebar = screen.getByRole('complementary');

    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    expect(sidebar).toHaveClass('md:w-[384px]');
    expect(collapseButton).toBeInTheDocument();
  });

  it('should collapse the sidebar when clicking the collapse button', async () => {
    makeSut();

    const sidebar = screen.getByRole('complementary');

    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    await userEvent.click(collapseButton);

    const expandButton = screen.getByRole('button', {
      name: /expandir sidebar/i,
    });
    const newPromptButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    expect(sidebar).toHaveClass('md:w-18');
    expect(collapseButton).not.toBeInTheDocument();
    expect(expandButton).toBeInTheDocument();
    expect(newPromptButton).toBeInTheDocument();
  });

  it('should expand the sidebar when clicking the exapand button', async () => {
    makeSut();

    const sidebar = screen.getByRole('complementary');

    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    await userEvent.click(collapseButton);

    const expandButton = screen.getByRole('button', {
      name: /expandir sidebar/i,
    });

    await userEvent.click(expandButton);

    const collapseButtonSecond = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    expect(sidebar).toHaveClass('md:w-[384px]');
    expect(collapseButtonSecond).toBeInTheDocument();
    expect(expandButton).not.toBeInTheDocument();
  });

  it('should render the prompt list', () => {
    const input = [
      {
        id: '1',
        title: 'Title 1',
        content: 'Content 1',
      },
      {
        id: '2',
        title: 'Title 2',
        content: 'Content 2',
      },
    ];

    makeSut({ prompts: input });

    expect(screen.getByText(input[0].title)).toBeInTheDocument();
    expect(screen.getAllByRole('paragraph')).toHaveLength(input.length);
  });

  it('should update the search field when typing', async () => {
    makeSut();
    const text = 'Teste';
    const searchField = screen.getByPlaceholderText(/buscar prompt/i);

    await userEvent.type(searchField, text);

    expect(searchField).toHaveValue(text);
  });

  it('should navigate with encoded URL when typing in the search field and clear the search field', async () => {
    const text = 'A B';
    makeSut();
    const searchField = screen.getByPlaceholderText(/buscar prompt/i);

    await userEvent.type(searchField, text);
    await waitFor(() =>
      expect(pushMock).toHaveBeenLastCalledWith('/?q=A%20B', {
        scroll: false,
      })
    );

    await userEvent.clear(searchField);
    await waitFor(() =>
      expect(pushMock).toHaveBeenLastCalledWith('/', { scroll: false })
    );
  });

  it('should initialize the search field with the query parameter', async () => {
    const text = 'Teste';
    const searchParams = new URLSearchParams();
    searchParams.set('q', text);
    mockSearchParams = searchParams;
    makeSut();
    const searchField = screen.getByPlaceholderText(/buscar prompt/i);

    await waitFor(() => expect(searchField).toHaveValue(text));
  });

  it('should not render the prompt list when the sidebar is collapsed', async () => {
    makeSut();

    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    const promptList = screen.queryByRole('navigation', {
      name: /lista de prompts/i,
    });

    await userEvent.click(collapseButton);

    expect(promptList).not.toBeInTheDocument();
  });

  it('should render the prompt list when the sidebar is expanded', async () => {
    makeSut();

    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    const promptList = screen.queryByRole('navigation', {
      name: /lista de prompts/i,
    });

    expect(collapseButton).toBeInTheDocument();
    expect(promptList).toBeInTheDocument();
  });

  it('should submit the form when typing in the search field', async () => {
    const submitSpy = jest
      .spyOn(HTMLFormElement.prototype, 'requestSubmit')
      .mockImplementation(() => undefined);

    makeSut();

    const searchField = screen.getByPlaceholderText(/buscar prompt/i);

    await userEvent.type(searchField, 'AI');

    await waitFor(() => expect(submitSpy).toHaveBeenCalled());
    submitSpy.mockRestore();
  });

  it('should debounce the search and submit only once after typing stops', async () => {
    const submitSpy = jest
      .spyOn(HTMLFormElement.prototype, 'requestSubmit')
      .mockImplementation(() => undefined);

    makeSut();

    const searchField = screen.getByPlaceholderText(/buscar prompt/i);

    await userEvent.type(searchField, 'prompt');

    expect(submitSpy).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();

    await waitFor(() => expect(submitSpy).toHaveBeenCalledTimes(1));
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/?q=prompt', { scroll: false });
    submitSpy.mockRestore();
  });

  it('should submit automatically on initial render when a query param is provided', async () => {
    const submitSpy = jest
      .spyOn(HTMLFormElement.prototype, 'requestSubmit')
      .mockImplementation(() => undefined);

    const text = 'text';
    const searchParams = new URLSearchParams();
    searchParams.set('q', text);

    mockSearchParams = searchParams;

    makeSut();

    expect(submitSpy).toHaveBeenCalled();
    submitSpy.mockRestore();
  });

  it('deve abrir e fechar o menu mobile', async () => {
    makeSut();

    const aside = screen.getByRole('complementary');
    expect(aside.className).toContain('-translate-x-full');

    const menuButton = screen.getByRole('button', { name: /abrir menu/i });

    await userEvent.click(menuButton);

    expect(aside.className).toContain('translate-x-0');

    const closeMenuButton = screen.getByRole('button', {
      name: /fechar menu/i,
    });
    await userEvent.click(closeMenuButton);

    expect(aside.className).toContain('-translate-x-full');
  });
});
