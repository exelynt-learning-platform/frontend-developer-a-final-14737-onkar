import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmationModal from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  test('renders nothing when show is false', () => {
    render(
      <DeleteConfirmationModal show={false} employeeName="John Doe" onCancel={jest.fn()} onConfirm={jest.fn()} />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('shows the confirmation message with the employee name when open', () => {
    render(
      <DeleteConfirmationModal show employeeName="John Doe" onCancel={jest.fn()} onConfirm={jest.fn()} />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete "john doe"/i)).toBeInTheDocument();
  });

  test('Cancel calls onCancel and not onConfirm', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    render(<DeleteConfirmationModal show employeeName="John Doe" onCancel={onCancel} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('Delete calls onConfirm', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(<DeleteConfirmationModal show employeeName="John Doe" onCancel={jest.fn()} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('disables buttons and shows "Deleting..." while loading', () => {
    render(
      <DeleteConfirmationModal show employeeName="John Doe" onCancel={jest.fn()} onConfirm={jest.fn()} loading />
    );
    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeDisabled();
  });
});
