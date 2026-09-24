import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeForm from './EmployeeForm';

const countries = [
  { id: '1', name: 'India' },
  { id: '2', name: 'Aruba' },
];

const renderForm = (props = {}) => {
  const onSubmit = jest.fn();
  const utils = render(
    <EmployeeForm
      countries={countries}
      countriesStatus="succeeded"
      countriesError={null}
      onSubmit={onSubmit}
      submitting={false}
      submitLabel="Add Employee"
      {...props}
    />
  );
  return { onSubmit, ...utils };
};

const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText(/^name/i), 'John Doe');
  await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/^mobile/i), '9876543210');
  await user.selectOptions(screen.getByLabelText(/^country/i), 'India');
  await user.type(screen.getByLabelText(/^state/i), 'Maharashtra');
  await user.type(screen.getByLabelText(/^district/i), 'Pune');
};

describe('EmployeeForm', () => {
  test('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mobile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^district/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('shows "Name is required." when name is left blank', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByLabelText(/^name/i));
    await user.tab();
    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
  });

  test('shows a length error for a too-short name', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText(/^name/i), 'A');
    await user.tab();
    expect(await screen.findByText(/name must be between/i)).toBeInTheDocument();
  });

  test('shows "Email is required." when email is left blank', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByLabelText(/^email/i));
    await user.tab();
    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
  });

  test('rejects an invalid email format', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText(/^email/i), 'john@');
    await user.tab();
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  test('accepts a valid email format', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText(/^email/i), 'john@gmail.com');
    await user.tab();
    expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument();
  });

  test('requires mobile and rejects an invalid mobile number', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByLabelText(/^mobile/i));
    await user.tab();
    expect(await screen.findByText('Mobile number is required.')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^mobile/i), '12345');
    await user.tab();
    expect(await screen.findByText(/valid 10-digit indian mobile number/i)).toBeInTheDocument();
  });

  test('requires country, state and district', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByLabelText(/^country/i));
    await user.tab();
    expect(await screen.findByText('Country is required.')).toBeInTheDocument();

    await user.click(screen.getByLabelText(/^state/i));
    await user.tab();
    expect(await screen.findByText('State is required.')).toBeInTheDocument();

    await user.click(screen.getByLabelText(/^district/i));
    await user.tab();
    expect(await screen.findByText('District is required.')).toBeInTheDocument();
  });

  test('does not call onSubmit when the form is invalid', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();
    await user.click(screen.getByRole('button', { name: /add employee/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit with the entered values when the form is valid', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
    });
  });

  test('pre-populates fields from initialValues (edit mode)', () => {
    renderForm({
      initialValues: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        mobile: '9876500000',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune',
      },
      submitLabel: 'Update Employee',
    });

    expect(screen.getByLabelText(/^name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/^email/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/^mobile/i)).toHaveValue('9876500000');
    expect(screen.getByLabelText(/^country/i)).toHaveValue('India');
  });

  test('shows a loading state for the country dropdown', () => {
    renderForm({ countriesStatus: 'loading' });
    expect(screen.getByText(/loading countries/i)).toBeInTheDocument();
  });

  test('shows an error state when countries fail to load', () => {
    renderForm({ countriesStatus: 'failed', countriesError: 'Unable to load countries.' });
    expect(screen.getByText('Unable to load countries.')).toBeInTheDocument();
  });
});
