import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import EmployeeListContainer from './EmployeeListContainer';
import employeeReducer from '../features/employees/employeeSlice';
import countryReducer from '../features/countries/countrySlice';
import employeeService from '../services/employeeService';

jest.mock('../services/employeeService');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const sampleEmployees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune',
  },
];

const renderWithProviders = () => {
  const store = configureStore({ reducer: { employees: employeeReducer, countries: countryReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/employees']}>
        <EmployeeListContainer />
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('EmployeeListContainer', () => {
  test('shows a loading state while employees are being fetched', async () => {
    let resolvePromise;
    employeeService.getEmployees.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );
    renderWithProviders();
    expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
    resolvePromise([]);
    await waitFor(() => expect(screen.queryByText(/loading employees/i)).not.toBeInTheDocument());
  });

  test('renders the employee list once loaded', async () => {
    employeeService.getEmployees.mockResolvedValueOnce(sampleEmployees);
    renderWithProviders();

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('shows an error state when the fetch fails', async () => {
    employeeService.getEmployees.mockRejectedValueOnce(new Error('Unable to load employees. Please try again.'));
    renderWithProviders();

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load employees. Please try again.');
  });

  test('shows an empty state when there are no employees', async () => {
    employeeService.getEmployees.mockResolvedValueOnce([]);
    renderWithProviders();

    expect(await screen.findByText('No employees found.')).toBeInTheDocument();
  });

  test('renders an Edit link for each employee', async () => {
    employeeService.getEmployees.mockResolvedValueOnce(sampleEmployees);
    renderWithProviders();

    const editLink = await screen.findByRole('link', { name: /edit john doe/i });
    expect(editLink).toHaveAttribute('href', '/employees/edit/1');
  });

  test('clicking Delete opens the confirmation modal', async () => {
    const user = userEvent.setup();
    employeeService.getEmployees.mockResolvedValueOnce(sampleEmployees);
    renderWithProviders();

    await user.click(await screen.findByRole('button', { name: /delete john doe/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(employeeService.deleteEmployee).not.toHaveBeenCalled();
  });

  test('Cancel closes the modal without calling the delete API', async () => {
    const user = userEvent.setup();
    employeeService.getEmployees.mockResolvedValueOnce(sampleEmployees);
    renderWithProviders();

    await user.click(await screen.findByRole('button', { name: /delete john doe/i }));
    await user.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(employeeService.deleteEmployee).not.toHaveBeenCalled();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('confirming delete calls the API, removes the row and shows a success toast', async () => {
    const user = userEvent.setup();
    employeeService.getEmployees.mockResolvedValueOnce(sampleEmployees);
    employeeService.deleteEmployee.mockResolvedValueOnce('1');
    renderWithProviders();

    await user.click(await screen.findByRole('button', { name: /delete john doe/i }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }));

    await waitFor(() => expect(screen.queryByText('John Doe')).not.toBeInTheDocument());
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith('1');
    expect(toast.success).toHaveBeenCalled();
    expect(screen.getByText('No employees found.')).toBeInTheDocument();
  });

  test('a failed delete keeps the employee in the list and shows an error toast', async () => {
    const user = userEvent.setup();
    employeeService.getEmployees.mockResolvedValueOnce(sampleEmployees);
    employeeService.deleteEmployee.mockRejectedValueOnce(new Error('Unable to delete employee. Please try again.'));
    renderWithProviders();

    await user.click(await screen.findByRole('button', { name: /delete john doe/i }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
