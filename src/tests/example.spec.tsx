import { render, screen } from '@testing-library/react';

describe('Example', () => {
  it('should pass this test', () => {
    render(<div>Teste</div>);

    expect(screen.getByText(/teste/i)).toBeInTheDocument();
  });
});
