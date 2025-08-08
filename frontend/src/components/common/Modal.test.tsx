import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { useState } from 'react';

import Modal from './shared/Modal';

import { ModalButtonMode } from '../types';

describe('Modal component', () => {
  test('renders with the correct content', () => {
    render(<Modal content="Test Message" />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('does not render when content is null', () => {
    render(<Modal content={null} />);
    expect(screen.queryByText('Test Message')).toBeNull();
  });

  test('applies default props when none are provided (green styles)', () => {
    render(<Modal content="Test Message" />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toHaveClass('text-orange-500');
  });

  test('applies red styles when isError is true', () => {
    render(<Modal content="Error Message" errorMode={true} />);
    const modalElement = screen.getByText('Error Message');
    expect(modalElement).toHaveClass('text-red-500');
  });

  test('renders with the wanted structure', () => {
    render(<Modal content="Test Message" />);
    const modalElement = screen.getByText('Test Message');
    expect(modalElement).toBeInTheDocument();
    expect(modalElement.parentElement).toHaveClass(
      'fixed inset-0 bg-black/70 z-50 flex items-center justify-center'
    );
  });

  test('renders with action buttons when buttonMode is "YesNoButtons"', () => {
    render(
      <Modal
        content="Test Message"
        buttonMode={ModalButtonMode.YesNoButtons}
        confirmHandler={() => {}}
        closingHandler={() => {}}
      />
    );
    expect(screen.getByText('Kyllä')).toBeInTheDocument();
    expect(screen.getByText('Ei')).toBeInTheDocument();
  });

  test('renders with action button when buttonMode is "OkButton"', () => {
    render(
      <Modal
        content="Test Message"
        buttonMode={ModalButtonMode.OkButton}
        closingHandler={() => {}}
      />
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('renders with action button when buttonMode is "CloseButton"', () => {
    render(
      <Modal
        content="Test Message"
        buttonMode={ModalButtonMode.CloseButton}
        closingHandler={() => {}}
      />
    );
    expect(screen.getByText('Sulje')).toBeInTheDocument();
  });

  test('does not render action buttons when buttonMode is "NoButtons"', () => {
    render(<Modal content="Test Message" buttonMode={ModalButtonMode.NoButtons} />);
    expect(screen.queryByText('Kyllä')).toBeNull();
    expect(screen.queryByText('Ei')).toBeNull();
    expect(screen.queryByText('OK')).toBeNull();
  });

  test('calls confirmHandler when Yes button is clicked', async () => {
    const mockConfirmHandler = vi.fn();
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        content="Test Message"
        confirmHandler={mockConfirmHandler}
        closingHandler={mockCancelHandler}
        buttonMode={ModalButtonMode.YesNoButtons}
      />
    );

    const user = userEvent.setup();
    const yesButton = screen.getByText('Kyllä');
    await user.click(yesButton);

    expect(mockConfirmHandler).toHaveBeenCalledTimes(1);
    expect(mockCancelHandler).not.toHaveBeenCalled();
  });

  test('calls closingHandler when No button is clicked', async () => {
    const mockConfirmHandler = vi.fn();
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        content="Test Message"
        confirmHandler={mockConfirmHandler}
        closingHandler={mockCancelHandler}
        buttonMode={ModalButtonMode.YesNoButtons}
      />
    );

    const user = userEvent.setup();
    const noButton = screen.getByText('Ei');
    await user.click(noButton);

    expect(mockCancelHandler).toHaveBeenCalledTimes(1);
    expect(mockConfirmHandler).not.toHaveBeenCalled();
  });

  test('calls closingHandler when OK button is clicked', async () => {
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        content="Test Message"
        closingHandler={mockCancelHandler}
        buttonMode={ModalButtonMode.OkButton}
      />
    );

    const user = userEvent.setup();
    const okButton = screen.getByText('OK');
    await user.click(okButton);

    expect(mockCancelHandler).toHaveBeenCalledTimes(1);
  });

  test('calls closingHandler when modal is clicked outside for closing', async () => {
    const mockCancelHandler = vi.fn();

    render(
      <Modal
        content="Test Message"
        closingHandler={mockCancelHandler}
        buttonMode={ModalButtonMode.NoButtons}
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
      const [content, setContent] = useState<React.ReactNode>('Test Message');
      return (
        <Modal
          content={content}
          closingHandler={() => setContent(null)}
          buttonMode={ModalButtonMode.NoButtons}
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
      const [content, setContent] = useState<React.ReactNode>('Test Message');
      return (
        <Modal
          content={content}
          closingHandler={() => setContent(null)}
          buttonMode={ModalButtonMode.NoButtons}
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
