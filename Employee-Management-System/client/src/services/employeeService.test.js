import axios from 'axios';

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('axios', () => ({
  create: jest.fn(),
}));

axios.create.mockReturnValue(mockAxiosInstance);

// Import after mocking axios so employeeService is built on top of the mock instance.
// eslint-disable-next-line import/first
import employeeService from './employeeService';

const rawEmployee = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
  avatar: 'https://example.com/avatar.png',
  createdAt: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('employeeService', () => {
  test('getEmployees maps the API response to normalised employee objects', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [rawEmployee] });

    const result = await employeeService.getEmployees();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/employee');
    expect(result).toEqual([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune',
      },
    ]);
  });

  test('getEmployees throws a friendly error when the request fails', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce(new Error('network down'));
    await expect(employeeService.getEmployees()).rejects.toThrow(
      'Unable to load employees. Please try again.'
    );
  });

  test('getEmployeeById fetches a single employee by id', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: rawEmployee });

    const result = await employeeService.getEmployeeById('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/employee/1');
    expect(result.id).toBe('1');
    expect(result.name).toBe('John Doe');
  });

  test('getEmployeeById surfaces a not-found error on 404', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce({ response: { status: 404 } });
    await expect(employeeService.getEmployeeById('999')).rejects.toThrow('Employee not found.');
  });

  test('createEmployee posts only the business fields', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({ data: rawEmployee });

    const result = await employeeService.createEmployee({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/employee', {
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
    });
    expect(result.id).toBe('1');
  });

  test('createEmployee throws a friendly error when the request fails', async () => {
    mockAxiosInstance.post.mockRejectedValueOnce(new Error('boom'));
    await expect(employeeService.createEmployee({})).rejects.toThrow(
      'Unable to add employee. Please try again.'
    );
  });

  test('updateEmployee sends a PUT request to the right endpoint', async () => {
    mockAxiosInstance.put.mockResolvedValueOnce({ data: { ...rawEmployee, name: 'Jane Doe' } });

    const result = await employeeService.updateEmployee('1', { ...rawEmployee, name: 'Jane Doe' });

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/employee/1', expect.objectContaining({ name: 'Jane Doe' }));
    expect(result.name).toBe('Jane Doe');
  });

  test('updateEmployee throws a friendly error when the request fails', async () => {
    mockAxiosInstance.put.mockRejectedValueOnce(new Error('boom'));
    await expect(employeeService.updateEmployee('1', {})).rejects.toThrow(
      'Unable to update employee. Please try again.'
    );
  });

  test('deleteEmployee sends a DELETE request and resolves with the id', async () => {
    mockAxiosInstance.delete.mockResolvedValueOnce({});
    const result = await employeeService.deleteEmployee('1');
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/employee/1');
    expect(result).toBe('1');
  });

  test('deleteEmployee throws a friendly error when the request fails', async () => {
    mockAxiosInstance.delete.mockRejectedValueOnce(new Error('boom'));
    await expect(employeeService.deleteEmployee('1')).rejects.toThrow(
      'Unable to delete employee. Please try again.'
    );
  });
});
