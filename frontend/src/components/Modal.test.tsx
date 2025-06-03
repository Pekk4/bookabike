import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { useState } from 'react';

import Modal from './Modal';

import { ModalButtonMode } from '../types';

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
    render(<Modal message="Error Message" errorMode={true} />);
    const modalElement = screen.getByText('Error Message');
    expect(modalElement).toHaveClass('text-[#ff0000]');
    expect(modalElement).toHaveClass('border-[#c40000]');
  });

  test('renders with the wanted structure', () => {
    render(<Modal message="Test Message" />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toBeInTheDocument();
    expect(modalElement.parentElement).toHaveClass(
      'fixed inset-0 bg-black/60 z-50 flex items-center justify-center'
    );
  });

  test('renders with action buttons when mode is "YesNoButtons"', () => {
    render(
      <Modal
        message="Test Message"
        mode={ModalButtonMode.YesNoButtons}
        confirmHandler={() => {}}
        cancelHandler={() => {}}
      />
    );
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('renders with action button when mode is "OkButton"', () => {
    render(
      <Modal message="Test Message" mode={ModalButtonMode.OkButton} cancelHandler={() => {}} />
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('does not render action buttons when mode is "NoButtons"', () => {
    render(<Modal message="Test Message" mode={ModalButtonMode.NoButtons} />);
    expect(screen.queryByText('Yes')).toBeNull();
    expect(screen.queryByText('No')).toBeNull();
    expect(screen.queryByText('OK')).toBeNull();
  });

  test('calls confirmHandler when Yes button is clicked', async () => {
    const mockConfirmHandler = vi.fn();
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        message="Test Message"
        confirmHandler={mockConfirmHandler}
        cancelHandler={mockCancelHandler}
        mode={ModalButtonMode.YesNoButtons}
      />
    );

    const user = userEvent.setup();
    const yesButton = screen.getByText('Yes');
    await user.click(yesButton);

    expect(mockConfirmHandler).toHaveBeenCalledTimes(1);
    expect(mockCancelHandler).not.toHaveBeenCalled();
  });

  test('calls cancelHandler when No button is clicked', async () => {
    const mockConfirmHandler = vi.fn();
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        message="Test Message"
        confirmHandler={mockConfirmHandler}
        cancelHandler={mockCancelHandler}
        mode={ModalButtonMode.YesNoButtons}
      />
    );

    const user = userEvent.setup();
    const noButton = screen.getByText('No');
    await user.click(noButton);

    expect(mockCancelHandler).toHaveBeenCalledTimes(1);
    expect(mockConfirmHandler).not.toHaveBeenCalled();
  });

  test('calls cancelHandler when OK button is clicked', async () => {
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        message="Test Message"
        cancelHandler={mockCancelHandler}
        mode={ModalButtonMode.OkButton}
      />
    );

    const user = userEvent.setup();
    const okButton = screen.getByText('OK');
    await user.click(okButton);

    expect(mockCancelHandler).toHaveBeenCalledTimes(1);
  });

  test('calls cancelHandler when modal is clicked outside for closing', async () => {
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        message="Test Message"
        cancelHandler={mockCancelHandler}
        mode={ModalButtonMode.NoButtons}
      />
    );

    const user = userEvent.setup();
    const modalBackground = screen.getByText('Test Message').parentElement;

    if (modalBackground) {
      await user.click(modalBackground);
    }

    expect(mockCancelHandler).toHaveBeenCalledTimes(1);
  });

  test('closes when clicking outside of the modal content', async () => {
    const ModalTestWrapper = () => {
      const [message, setMessage] = useState<React.ReactNode>('Test Message');
      return (
        <Modal
          message={message}
          cancelHandler={() => setMessage(null)}
          mode={ModalButtonMode.NoButtons}
        />
      );
    };

    render(<ModalTestWrapper />);

    const user = userEvent.setup();
    const modalBackground = screen.getByText('Test Message').parentElement;

    expect(screen.getByText('Test Message')).toBeInTheDocument();

    if (modalBackground) {
      await user.click(modalBackground);
    }

    expect(screen.queryByText('Test Message')).toBeNull();
  });

  test('does not close when clicking inside the modal content', async () => {
    const ModalTestWrapper = () => {
      const [message, setMessage] = useState<React.ReactNode>('Test Message');
      return (
        <Modal
          message={message}
          cancelHandler={() => setMessage(null)}
          mode={ModalButtonMode.NoButtons}
        />
      );
    };

    render(<ModalTestWrapper />);

    const user = userEvent.setup();
    const modalContent = screen.getByText('Test Message');

    await user.click(modalContent);

    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });
});
