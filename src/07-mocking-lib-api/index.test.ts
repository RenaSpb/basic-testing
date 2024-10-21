/* eslint-disable prettier/prettier */
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

// Mock axios module
jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks before each test
  });

  test('should create instance with provided base url', async () => {
    const mockAxiosCreate = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
    });
    (axios.create as jest.Mock) = mockAxiosCreate;

    await throttledGetDataFromApi('/test');

    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    const testPath = '/users/1';
    await throttledGetDataFromApi(testPath);

    await throttledGetDataFromApi.flush();
    expect(mockGet).toHaveBeenCalledWith(testPath);
  });

  test('should return response data from API', async () => {

  });


});
