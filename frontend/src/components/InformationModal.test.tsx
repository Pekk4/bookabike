import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Modal from './InformationModal';

describe('Modal component', () => {
  test('renders with the correct message', () => {
    render(<Modal message="Test Message" />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('does not render when message is null', () => {
    render(<Modal message={null} />);
    expect(screen.queryByText('Test Message')).toBeNull();
  });

  test('applies default props when none are provided (green styles)', () => {
    render(<Modal message="Test Message" />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toHaveClass('text-[#00b100]');
    expect(modalElement).toHaveClass('border-[#2ee700]');
  });

  test('applies red styles when isError is true', () => {
    render(<Modal message="Error Message" isError={true} />);
    const modalElement = screen.getByText('Error Message');
    expect(modalElement).toHaveClass('text-[#ff0000]');
    expect(modalElement).toHaveClass('border-[#c40000]');
  });

  test('renders the modal with the correct structure', () => {
    render(<Modal message="Test Message" />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toBeInTheDocument();
    expect(modalElement.parentElement).toHaveClass(
      'fixed inset-0 bg-black/60 z-50 flex items-center justify-center'
    );
  });
});
