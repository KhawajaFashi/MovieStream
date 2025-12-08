import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create mocks
const mockUser = jest.fn();
mockUser.findOne = jest.fn();
mockUser.findById = jest.fn();
mockUser.findByIdAndDelete = jest.fn();

const mockSetUser = jest.fn();
const mockDecryptPassword = jest.fn();
const mockEncryptPassword = jest.fn();
const mockNext = jest.fn();

// Register mocks
jest.unstable_mockModule('../models/user.js', () => ({
    default: mockUser
}));
jest.unstable_mockModule('../service/auth.js', () => ({
    setUser: mockSetUser
}));
jest.unstable_mockModule('../utils/HashPassword.js', () => ({
    decryptPassword: mockDecryptPassword,
    encryptPassword: mockEncryptPassword
}));

// Dynamic imports
const { handleUserSignIn, handleUserSignUp } = await import('./user.js');
const { default: User } = await import('../models/user.js');
const { setUser } = await import('../service/auth.js');
const { decryptPassword } = await import('../utils/HashPassword.js');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn()
        };
        mockNext.mockClear();
        jest.clearAllMocks();
    });

    describe('handleUserSignIn', () => {
        it('should sign in a user with valid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
            const foundUser = { _id: '123', email: 'test@example.com', password: 'hashedPassword' };

            User.findOne.mockResolvedValue(foundUser);
            decryptPassword.mockResolvedValue(true);
            setUser.mockReturnValue('mockToken');

            await handleUserSignIn(req, res, mockNext);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(decryptPassword).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(setUser).toHaveBeenCalledWith(foundUser);
            expect(res.cookie).toHaveBeenCalledWith('uid', 'mockToken', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ found: true }));
        });

        it('should call next with error if user not found', async () => {
            req.body = { email: 'nonexistent@example.com', password: 'password123' };
            User.findOne.mockResolvedValue(null);

            await handleUserSignIn(req, res, mockNext);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should call next with error if password does not match', async () => {
            req.body = { email: 'test@example.com', password: 'wrongPassword' };
            const foundUser = { _id: '123', email: 'test@example.com', password: 'hashedPassword' };

            User.findOne.mockResolvedValue(foundUser);
            decryptPassword.mockResolvedValue(false);

            await handleUserSignIn(req, res, mockNext);

            expect(decryptPassword).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('handleUserSignUp', () => {
        it('should create a new user successfully', async () => {
            req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
            const mockCreatedUser = {
                _id: '123',
                username: 'testuser',
                email: 'test@example.com',
                save: jest.fn().mockResolvedValue(true)
            };

            User.mockImplementation(() => mockCreatedUser);
            setUser.mockReturnValue('mockToken');

            await handleUserSignUp(req, res, mockNext);

            expect(User).toHaveBeenCalledWith(expect.objectContaining({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }));
            expect(mockCreatedUser.save).toHaveBeenCalled();
            expect(setUser).toHaveBeenCalledWith(mockCreatedUser);
            expect(res.cookie).toHaveBeenCalledWith('uid', 'mockToken', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User is has been successfully created" }));
        });
    });
});
