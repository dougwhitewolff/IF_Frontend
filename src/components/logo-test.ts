import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  it('renders the logo with default props', () => {
    render(<Logo />);
    const img = screen.getByAltText('Transformation Math Logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src');
  });

  it('uses correct image source based on variant', () => {
    const { rerender } = render(<Logo variant="white" />);
    let img = screen.getByAltText('Transformation Math Logo');
    expect(img).toHaveAttribute('src', expect.stringContaining('white'));

    rerender(<Logo variant="black" />);
    img = screen.getByAltText('Transformation Math Logo');
    expect(img).toHaveAttribute('src', expect.stringContaining('black'));
  });

  it('applies custom dimensions', () => {
    render(<Logo width={300} height={90} />);
    const img = screen.getByAltText('Transformation Math Logo');
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '90');
  });

  it('renders as a link when href is provided', () => {
    render(<Logo href="/dashboard" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
