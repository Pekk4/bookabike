import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import Modal from './Modal';

describe('Modal component', () => {
  test('renders with the correct message', () => {
    render(<Modal message="Test Message" yesHandler={() => {}} noHandler={() => {}} />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('does not render when message is null', () => {
    render(<Modal message={null} yesHandler={() => {}} noHandler={() => {}} />);
    expect(screen.queryByText('Test Message')).toBeNull();
  });

  test('applies default props when none are provided (green styles)', () => {
    render(<Modal message="Test Message" yesHandler={() => {}} noHandler={() => {}} />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toHaveClass('text-[#00b100]');
    expect(modalElement).toHaveClass('border-[#2ee700]');
  });

  test('applies red styles when isError is true', () => {
    render(
      <Modal message="Error Message" isError={true} yesHandler={() => {}} noHandler={() => {}} />
    );
    const modalElement = screen.getByText('Error Message');
    expect(modalElement).toHaveClass('text-[#ff0000]');
    expect(modalElement).toHaveClass('border-[#c40000]');
  });

  test('renders the modal with the correct structure', () => {
    render(<Modal message="Test Message" yesHandler={() => {}} noHandler={() => {}} />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toBeInTheDocument();
    expect(modalElement.parentElement).toHaveClass(
      'fixed inset-0 bg-black/60 z-50 flex items-center justify-center'
    );
  });

  test('calls yesHandler when Yes button is clicked', async () => {
    const mockYesHandler = vi.fn();
    const mockNoHandler = vi.fn();

    render(<Modal message="Test Message" yesHandler={mockYesHandler} noHandler={() => {}} />);

    const user = userEvent.setup();
    const yesButton = screen.getByText('Yes');
    await user.click(yesButton);

    expect(mockYesHandler).toHaveBeenCalledTimes(1);
    expect(mockNoHandler).not.toHaveBeenCalled();
  });

  test('calls noHandler when No button is clicked', async () => {
    const mockYesHandler = vi.fn();
    const mockNoHandler = vi.fn();

    render(<Modal message="Test Message" noHandler={mockNoHandler} yesHandler={() => {}} />);

    const user = userEvent.setup();
    const noButton = screen.getByText('No');
    await user.click(noButton);

    expect(mockNoHandler).toHaveBeenCalledTimes(1);
    expect(mockYesHandler).not.toHaveBeenCalled();
  });
});
