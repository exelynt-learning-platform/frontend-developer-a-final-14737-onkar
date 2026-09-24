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

// eslint-disable-next-line import/first
import countryService from './countryService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('countryService', () => {
  test('getCountries maps the "country" field to "name" and sorts alphabetically', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: [
        { id: '2', country: 'Zambia' },
        { id: '1', country: 'Aruba' },
      ],
    });

    const result = await countryService.getCountries();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/country');
    expect(result).toEqual([
      { id: '1', name: 'Aruba' },
      { id: '2', name: 'Zambia' },
    ]);
  });

  test('getCountries throws a friendly error when the request fails', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce(new Error('network down'));
    await expect(countryService.getCountries()).rejects.toThrow(
      'Unable to load countries. Please try again.'
    );
  });
});
