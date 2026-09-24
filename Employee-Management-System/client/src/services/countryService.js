import apiClient, { getErrorMessage } from './apiClient';

const RESOURCE = '/country';

// The mock API stores the country's display name under the "country" key
// (not "name"). Mapping it here keeps that quirk out of the rest of the app.
const mapCountry = (raw) => ({
  id: String(raw.id),
  name: raw.country ?? raw.name ?? '',
});

const countryService = {
  async getCountries() {
    try {
      const response = await apiClient.get(RESOURCE);
      return response.data
        .map(mapCountry)
        .filter((c) => c.name)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to load countries. Please try again.'));
    }
  },
};

export default countryService;
