import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeSearch from './EmployeeSearch';

describe('EmployeeSearch', () => {
  test('renders the ID input, search and clear buttons', () => {
    render(<EmployeeSearch onSearch={jest.fn()} onClear={jest.fn()} loading={false} />);
    expect(screen.getByLabelText(/employee id/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  test('validates an empty ID and does not call onSearch', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<EmployeeSearch onSearch={onSearch} onClear={jest.fn()} loading={false} />);

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/please enter an employee id/i)).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  test('calls onSearch with the trimmed ID when valid', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<EmployeeSearch onSearch={onSearch} onClear={jest.fn()} loading={false} />);

    await user.type(screen.getByLabelText(/employee id/i), ' 12 ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('12');
  });

  test('shows a loading label on the search button while searching', () => {
    render(<EmployeeSearch onSearch={jest.fn()} onClear={jest.fn()} loading />);
    expect(screen.getByRole('button', { name: /searching/i })).toBeInTheDocument();
  });

  test('calls onClear and resets the input when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();
    render(<EmployeeSearch onSearch={jest.fn()} onClear={onClear} loading={false} />);

    const input = screen.getByLabelText(/employee id/i);
    await user.type(input, '12');
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
  });
});
