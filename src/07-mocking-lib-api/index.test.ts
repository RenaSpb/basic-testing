import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    const throttled = (...args: never[]) => fn(...args);
    throttled.flush = jest.fn();
    return throttled;
  }),
}));

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const mockResponseData = { id: 1, name: 'Test User' };
    const mockGet = jest.fn().mockResolvedValue({ data: mockResponseData });
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await throttledGetDataFromApi('/users/1');
    await throttledGetDataFromApi.flush();

    expect(result).toEqual(mockResponseData);
  });
});
