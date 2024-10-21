/* eslint-disable prettier/prettier */
import {  simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 4, b: 2, action: Action.Subtract, expected: 2 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 3, b: 3, action: Action.Multiply, expected: 9 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },
  { a: 7, b: 2, action: Action.Divide, expected: 3.5 },
  { a: 2, b: 0, action: Action.Divide, expected: Infinity },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 2, b: 2, action: 'invalid', expected: null },
  { a: '8', b: 2, action: Action.Add, expected: null },
  { a: 2, b: 'string', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should calculate $action with a = $a and b = $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toEqual(expected);
    }
  );
});
