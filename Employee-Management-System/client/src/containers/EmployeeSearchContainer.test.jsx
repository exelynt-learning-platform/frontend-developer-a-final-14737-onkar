import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import EmployeeSearchContainer from './EmployeeSearchContainer';
import employeeReducer from '../features/employees/employeeSlice';
import employeeService from '../services/employeeService';

jest.mock('../services/employeeService');

const sampleEmployee = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
};

const renderWithProviders = () => {
  const store = configureStore({ reducer: { employees: employeeReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/employees/search']}>
        <EmployeeSearchContainer />
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('EmployeeSearchContainer', () => {
  test('renders the search form', () => {
    renderWithProviders();
    expect(screen.getByLabelText(/employee id/i)).toBeInTheDocument();
  });

  test('does not call the API for an empty ID', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(employeeService.getEmployeeById).not.toHaveBeenCalled();
  });

  test('shows a loading state while searching', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    employeeService.getEmployeeById.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );
    renderWithProviders();

    await user.type(screen.getByLabelText(/employee id/i), '1');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/searching\.\.\./i)).toBeInTheDocument();
    resolvePromise(sampleEmployee);
    await waitFor(() => expect(screen.queryByText(/^searching\.\.\.$/i)).not.toBeInTheDocument());
  });

  test('displays the employee when found', async () => {
    const user = userEvent.setup();
    employeeService.getEmployeeById.mockResolvedValueOnce(sampleEmployee);
    renderWithProviders();

    await user.type(screen.getByLabelText(/employee id/i), '1');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('shows "Employee not found." when the employee does not exist', async () => {
    const user = userEvent.setup();
    employeeService.getEmployeeById.mockRejectedValueOnce(new Error('Employee not found.'));
    renderWithProviders();

    await user.type(screen.getByLabelText(/employee id/i), '999');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Employee not found.')).toBeInTheDocument();
  });

  test('shows a generic error message when the API call fails', async () => {
    const user = userEvent.setup();
    employeeService.getEmployeeById.mockRejectedValueOnce(
      new Error('Unable to search employee. Please try again.')
    );
    renderWithProviders();

    await user.type(screen.getByLabelText(/employee id/i), '1');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Unable to search employee. Please try again.')).toBeInTheDocument();
  });

  test('Clear removes the search result', async () => {
    const user = userEvent.setup();
    employeeService.getEmployeeById.mockResolvedValueOnce(sampleEmployee);
    renderWithProviders();

    await user.type(screen.getByLabelText(/employee id/i), '1');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(await screen.findByText('John Doe')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
