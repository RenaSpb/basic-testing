/* eslint-disable prettier/prettier */
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    mockedAxios.create.mockReturnValue({ get: mockGet } as any);

    await throttledGetDataFromApi('/test');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    mockedAxios.create.mockReturnValue({ get: mockGet } as any);

    await throttledGetDataFromApi('/user/test');

    expect(mockGet).toHaveBeenCalledWith('/user/test');
  });

  test('should return response data', async () => {
    const mockResponseData = { id: 1, name: 'Test User' };
    const mockGet = jest.fn().mockResolvedValue({ data: mockResponseData });
    mockedAxios.create.mockReturnValue({ get: mockGet } as any);

    const result = await throttledGetDataFromApi('/user/test');

    expect(result).toEqual(mockResponseData);
  });
});
