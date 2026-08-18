import { SidebarContent } from '@/components/sidebar/sidebar-content';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const pushMock = jest.fn();

jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: pushMock,
    }),
  };
});

const makeSut = () => {
  render(<SidebarContent />);
};

describe('SidebarContent', () => {
  it('should render the sidebar content', () => {
    makeSut();

    const header = screen.getByRole('banner');

    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/prompt manager/i);
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

    expect(sidebar).toHaveClass('md:w-18');
    expect(collapseButton).not.toBeInTheDocument();
    expect(expandButton).toBeInTheDocument();
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
});
