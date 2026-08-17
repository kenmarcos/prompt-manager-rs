import { SidebarContent } from '@/components/sidebar/sidebar-content';
import { render, screen } from '@testing-library/react';

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

    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /novo prompt/i })
    ).toBeInTheDocument();
  });
});
