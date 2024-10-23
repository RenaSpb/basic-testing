import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(1000);
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(1000);
    expect(() => account.withdraw(1500)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(1500)).toThrow(
      `Insufficient funds: cannot withdraw more than ${account.getBalance()}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(1000);
    const account2 = getBankAccount(100);
    expect(() => account1.transfer(1200, account2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(1000);
    expect(() => account.transfer(100, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(100, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(1000);
    account.deposit(100);
    expect(account.getBalance()).toBe(1100);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000);
    account.withdraw(100);
    expect(account.getBalance()).toBe(900);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(1000);
    const account2 = getBankAccount(100);
    account1.transfer(200, account2);
    expect(account1.getBalance()).toBe(800);
    expect(account2.getBalance()).toBe(300);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(1000);
    const balance = await account.fetchBalance();
    if (balance != null) {
      expect(typeof balance).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(1000);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(800);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(800);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(1000);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
    await expect(account.synchronizeBalance()).rejects.toThrow('Synchronization failed');
  });
});
