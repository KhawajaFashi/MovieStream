import { jest, describe, it, expect } from '@jest/globals';

jest.unstable_mockModule('bcrypt', () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn(),
    }
}));

const { encryptPassword, decryptPassword } = await import('./HashPassword.js');
const { default: bcrypt } = await import('bcrypt');

describe('HashPassword Utils', () => {
    describe('encryptPassword', () => {
        it('should return a hashed password', async () => {
            const password = 'mySecretPassword';
            const mockedHash = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(mockedHash);

            const result = await encryptPassword(password);

            expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number));
            expect(result).toBe(mockedHash);
        });
    });

    describe('decryptPassword', () => {
        it('should return true if passwords match', async () => {
            const enteredPassword = 'mySecretPassword';
            const hashedPassword = 'hashedPassword123';
            bcrypt.compare.mockResolvedValue(true);

            const result = await decryptPassword(enteredPassword, hashedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false if passwords do not match', async () => {
            const enteredPassword = 'wrongPassword';
            const hashedPassword = 'hashedPassword123';
            bcrypt.compare.mockResolvedValue(false);

            const result = await decryptPassword(enteredPassword, hashedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, hashedPassword);
            expect(result).toBe(false);
        });
    });
});
