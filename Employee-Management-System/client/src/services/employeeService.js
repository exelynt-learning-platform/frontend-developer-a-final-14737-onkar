import apiClient, { getErrorMessage } from './apiClient';

const RESOURCE = '/employee';

// The mock API's seed data carries extra/legacy fields (avatar, emailId,
// createdAt). Normalising every response through this mapper means the
// rest of the app only ever sees the six business fields it cares about.
const mapEmployee = (raw) => ({
  id: String(raw.id),
  name: raw.name ?? '',
  email: raw.email ?? raw.emailId ?? '',
  mobile: raw.mobile ?? '',
  country: raw.country ?? '',
  state: raw.state ?? '',
  district: raw.district ?? '',
});

const toPayload = ({ name, email, mobile, country, state, district }) => ({
  name,
  email,
  mobile,
  country,
  state,
  district,
});

const employeeService = {
  async getEmployees() {
    try {
      const response = await apiClient.get(RESOURCE);
      return response.data.map(mapEmployee);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to load employees. Please try again.'));
    }
  },

  async getEmployeeById(id) {
    try {
      const response = await apiClient.get(`${RESOURCE}/${id}`);
      return mapEmployee(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Employee not found.');
      }
      throw new Error(getErrorMessage(error, 'Unable to search employee. Please try again.'));
    }
  },

  async createEmployee(data) {
    try {
      const response = await apiClient.post(RESOURCE, toPayload(data));
      return mapEmployee(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to add employee. Please try again.'));
    }
  },

  async updateEmployee(id, data) {
    try {
      const response = await apiClient.put(`${RESOURCE}/${id}`, toPayload(data));
      return mapEmployee(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to update employee. Please try again.'));
    }
  },

  async deleteEmployee(id) {
    try {
      await apiClient.delete(`${RESOURCE}/${id}`);
      return String(id);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to delete employee. Please try again.'));
    }
  },
};

export default employeeService;
