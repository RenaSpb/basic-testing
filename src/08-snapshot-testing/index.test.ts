/* eslint-disable prettier/prettier */
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const input = [1, 2, 3, 4];
    const expectedOutput = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: 4,
            next: {
              value: null,
              next: null,
            },
          },
        },
      },
    };
    expect(generateLinkedList(input)).toStrictEqual(expectedOutput);
  });

  test('should generate linked list from values 2', () => {
    const input = [5, 6, 7, 8];
    expect(generateLinkedList(input)).toMatchSnapshot();
  });
});
