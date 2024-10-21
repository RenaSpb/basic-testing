/* eslint-disable prettier/prettier */
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));
jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('/mocked/path'), // Заглушка для join
}));
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 100);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(90);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(setInterval).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(900);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1001);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    (existsSync as jest.MockedFunction<typeof existsSync>).mockReturnValue(false);
    await readFileAsynchronously('any.txt');
    expect(join).toHaveBeenCalledWith(expect.any(String), 'any.txt');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.MockedFunction<typeof existsSync>).mockReturnValue(false);
    const result = await readFileAsynchronously('test.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.MockedFunction<typeof existsSync>).mockReturnValue(true);
    (readFile as jest.MockedFunction<typeof readFile>).mockResolvedValue(Buffer.from('file content'));
    const result = await readFileAsynchronously('any.txt');
    expect(result).toBe('file content');
  });
});
