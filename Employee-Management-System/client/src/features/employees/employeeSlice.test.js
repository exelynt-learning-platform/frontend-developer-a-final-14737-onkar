import { configureStore } from '@reduxjs/toolkit';
import employeeReducer, {
  fetchEmployees,
  fetchEmployeeById,
  searchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  clearSearchResult,
  clearSelectedEmployee,
} from './employeeSlice';
import employeeService from '../../services/employeeService';

jest.mock('../../services/employeeService');

const sampleEmployee = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
};

const makeStore = () => configureStore({ reducer: { employees: employeeReducer } });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('employeeSlice - initial state', () => {
  test('returns the expected initial state', () => {
    const store = makeStore();
    const state = store.getState().employees;
    expect(state.items).toEqual([]);
    expect(state.listStatus).toBe('idle');
    expect(state.selectedEmployee).toBeNull();
    expect(state.searchResult).toBeNull();
    expect(state.operationStatus).toBe('idle');
  });
});

describe('fetchEmployees', () => {
  test('pending -> loading, fulfilled -> succeeded with items', async () => {
    employeeService.getEmployees.mockResolvedValueOnce([sampleEmployee]);
    const store = makeStore();

    const promise = store.dispatch(fetchEmployees());
    expect(store.getState().employees.listStatus).toBe('loading');

    await promise;
    const state = store.getState().employees;
    expect(state.listStatus).toBe('succeeded');
    expect(state.items).toEqual([sampleEmployee]);
  });

  test('rejected -> failed with an error message', async () => {
    employeeService.getEmployees.mockRejectedValueOnce(new Error('Unable to load employees. Please try again.'));
    const store = makeStore();

    await store.dispatch(fetchEmployees());
    const state = store.getState().employees;
    expect(state.listStatus).toBe('failed');
    expect(state.listError).toBe('Unable to load employees. Please try again.');
  });
});

describe('fetchEmployeeById (edit prefill)', () => {
  test('fulfilled sets selectedEmployee', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce(sampleEmployee);
    const store = makeStore();

    await store.dispatch(fetchEmployeeById('1'));
    const state = store.getState().employees;
    expect(state.selectedStatus).toBe('succeeded');
    expect(state.selectedEmployee).toEqual(sampleEmployee);
  });

  test('rejected sets selectedError and clearSelectedEmployee resets it', async () => {
    employeeService.getEmployeeById.mockRejectedValueOnce(new Error('Employee not found.'));
    const store = makeStore();

    await store.dispatch(fetchEmployeeById('999'));
    expect(store.getState().employees.selectedStatus).toBe('failed');

    store.dispatch(clearSelectedEmployee());
    const state = store.getState().employees;
    expect(state.selectedEmployee).toBeNull();
    expect(state.selectedStatus).toBe('idle');
  });
});

describe('searchEmployeeById', () => {
  test('fulfilled sets searchResult', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce(sampleEmployee);
    const store = makeStore();

    await store.dispatch(searchEmployeeById('1'));
    const state = store.getState().employees;
    expect(state.searchStatus).toBe('succeeded');
    expect(state.searchResult).toEqual(sampleEmployee);
  });

  test('rejected with "Employee not found." sets searchStatus to not-found', async () => {
    employeeService.getEmployeeById.mockRejectedValueOnce(new Error('Employee not found.'));
    const store = makeStore();

    await store.dispatch(searchEmployeeById('999'));
    const state = store.getState().employees;
    expect(state.searchStatus).toBe('not-found');
    expect(state.searchResult).toBeNull();
  });

  test('rejected with a generic error sets searchStatus to failed', async () => {
    employeeService.getEmployeeById.mockRejectedValueOnce(
      new Error('Unable to search employee. Please try again.')
    );
    const store = makeStore();

    await store.dispatch(searchEmployeeById('1'));
    const state = store.getState().employees;
    expect(state.searchStatus).toBe('failed');
    expect(state.searchError).toBe('Unable to search employee. Please try again.');
  });

  test('clearSearchResult resets search state', async () => {
    employeeService.getEmployeeById.mockResolvedValueOnce(sampleEmployee);
    const store = makeStore();
    await store.dispatch(searchEmployeeById('1'));

    store.dispatch(clearSearchResult());
    const state = store.getState().employees;
    expect(state.searchResult).toBeNull();
    expect(state.searchStatus).toBe('idle');
  });
});

describe('createEmployee', () => {
  test('fulfilled appends the new employee to items', async () => {
    employeeService.createEmployee.mockResolvedValueOnce(sampleEmployee);
    const store = makeStore();

    await store.dispatch(createEmployee(sampleEmployee));
    const state = store.getState().employees;
    expect(state.operationStatus).toBe('succeeded');
    expect(state.items).toEqual([sampleEmployee]);
  });

  test('rejected sets operationError and does not modify items', async () => {
    employeeService.createEmployee.mockRejectedValueOnce(new Error('Unable to add employee. Please try again.'));
    const store = makeStore();

    await store.dispatch(createEmployee(sampleEmployee));
    const state = store.getState().employees;
    expect(state.operationStatus).toBe('failed');
    expect(state.items).toEqual([]);
  });
});

describe('updateEmployee', () => {
  test('fulfilled replaces the matching employee in items', async () => {
    const updated = { ...sampleEmployee, name: 'Jane Doe' };
    employeeService.getEmployees.mockResolvedValueOnce([sampleEmployee]);
    employeeService.updateEmployee.mockResolvedValueOnce(updated);

    const store = makeStore();
    await store.dispatch(fetchEmployees());
    await store.dispatch(updateEmployee({ id: '1', data: updated }));

    const state = store.getState().employees;
    expect(state.items).toEqual([updated]);
    expect(state.operationStatus).toBe('succeeded');
  });

  test('rejected leaves items untouched', async () => {
    employeeService.getEmployees.mockResolvedValueOnce([sampleEmployee]);
    employeeService.updateEmployee.mockRejectedValueOnce(new Error('Unable to update employee. Please try again.'));

    const store = makeStore();
    await store.dispatch(fetchEmployees());
    await store.dispatch(updateEmployee({ id: '1', data: sampleEmployee }));

    const state = store.getState().employees;
    expect(state.items).toEqual([sampleEmployee]);
    expect(state.operationStatus).toBe('failed');
  });
});

describe('deleteEmployee', () => {
  test('fulfilled removes the employee from items', async () => {
    employeeService.getEmployees.mockResolvedValueOnce([sampleEmployee]);
    employeeService.deleteEmployee.mockResolvedValueOnce('1');

    const store = makeStore();
    await store.dispatch(fetchEmployees());
    await store.dispatch(deleteEmployee('1'));

    const state = store.getState().employees;
    expect(state.items).toEqual([]);
    expect(state.operationStatus).toBe('succeeded');
  });

  test('rejected keeps the employee in items and sets operationError', async () => {
    employeeService.getEmployees.mockResolvedValueOnce([sampleEmployee]);
    employeeService.deleteEmployee.mockRejectedValueOnce(new Error('Unable to delete employee. Please try again.'));

    const store = makeStore();
    await store.dispatch(fetchEmployees());
    await store.dispatch(deleteEmployee('1'));

    const state = store.getState().employees;
    expect(state.items).toEqual([sampleEmployee]);
    expect(state.operationStatus).toBe('failed');
    expect(state.operationError).toBe('Unable to delete employee. Please try again.');
  });
});
