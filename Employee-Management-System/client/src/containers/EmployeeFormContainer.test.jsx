import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EmployeeFormContainer from './EmployeeFormContainer';
import employeeReducer from '../features/employees/employeeSlice';
import countryReducer from '../features/countries/countrySlice';
import employeeService from '../services/employeeService';
import countryService from '../services/countryService';

jest.mock('../services/employeeService');
jest.mock('../services/countryService');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const countries = [{ id: '1', name: 'India' }];

const existingEmployee = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
};

const renderAtRoute = (initialEntry) => {
  const store = configureStore({ reducer: { employees: employeeReducer, countries: countryReducer } });
  countryService.getCountries.mockResolvedValue(countries);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/employees" element={<div>Employees Page</div>} />
          <Route path="/employees/add" element={<EmployeeFormContainer />} />
          <Route path="/employees/edit/:id" element={<EmployeeFormContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

const fillValidForm = async (user) => {
  await user.clear(screen.getByLabelText(/^name/i));
  await user.type(screen.getByLabelText(/^name/i), 'Jane Smith');
  await user.clear(screen.getByLabelText(/^email/i));
  await user.type(screen.getByLabelText(/^email/i), 'jane@example.com');
  await user.clear(screen.getByLabelText(/^mobile/i));
  await user.type(screen.getByLabelText(/^mobile/i), '9123456789');
  await user.selectOptions(screen.getByLabelText(/^country/i), 'India');
  await user.clear(screen.getByLabelText(/^state/i));
  await user.type(screen.getByLabelText(/^state/i), 'Maharashtra');
  await user.clear(screen.getByLabelText(/^district/i));
  await user.type(screen.getByLabelText(/^district/i), 'Pune');
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('EmployeeFormContainer - Add mode', () => {
  test('renders an empty form for adding an employee', async () => {
    renderAtRoute('/employees/add');
    expect(await screen.findByRole('heading', { name: /add employee/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^name/i)).toHaveValue('');
  });

  test('submits a valid form and navigates to the employee list', async () => {
    const user = userEvent.setup();
    employeeService.createEmployee.mockResolvedValueOnce({ ...existingEmployee, id: '2', name: 'Jane Smith' });
    renderAtRoute('/employees/add');

    await screen.findByRole('heading', { name: /add employee/i });
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => expect(employeeService.createEmployee).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Employees Page')).toBeInTheDocument();
  });
});

describe('EmployeeFormContainer - Edit mode', () => {
  test('fetches the employee and pre-populates the form', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce(existingEmployee);
    renderAtRoute('/employees/edit/1');

    expect(await screen.findByLabelText(/^name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/^email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/^mobile/i)).toHaveValue('9876543210');
    expect(employeeService.getEmployeeById).toHaveBeenCalledWith('1');
  });

  test('lets the user modify fields, validates and submits a PUT request', async () => {
    const user = userEvent.setup();
    employeeService.getEmployeeById.mockResolvedValueOnce(existingEmployee);
    employeeService.updateEmployee.mockResolvedValueOnce({ ...existingEmployee, name: 'Jane Smith' });
    renderAtRoute('/employees/edit/1');

    await screen.findByDisplayValue('John Doe');
    await user.clear(screen.getByLabelText(/^name/i));
    await user.type(screen.getByLabelText(/^name/i), 'Jane Smith');
    await user.click(screen.getByRole('button', { name: /update employee/i }));

    await waitFor(() =>
      expect(employeeService.updateEmployee).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ name: 'Jane Smith' })
      )
    );
    expect(await screen.findByText('Employees Page')).toBeInTheDocument();
  });

  test('shows "Employee not found." when the employee cannot be loaded', async () => {
    employeeService.getEmployeeById.mockRejectedValueOnce(new Error('Employee not found.'));
    renderAtRoute('/employees/edit/999');

    expect(await screen.findByText('Employee not found.')).toBeInTheDocument();
  });
});
