import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create mocks
const mockMovie = jest.fn();
mockMovie.find = jest.fn();
mockMovie.create = jest.fn();
mockMovie.findByIdAndUpdate = jest.fn();
mockMovie.updateMany = jest.fn();
mockMovie.findByIdAndDelete = jest.fn();
mockMovie.countDocuments = jest.fn();

const mockUser = jest.fn();
const mockGetOrSetCache = jest.fn();

// Register mocks
jest.unstable_mockModule('../models/movies.js', () => ({
    default: mockMovie
}));
jest.unstable_mockModule('../models/user.js', () => ({
    default: mockUser
}));
jest.unstable_mockModule('../utils/RedisCache.js', () => ({
    getOrSetCache: mockGetOrSetCache
}));

// Dynamic imports
const { deleteMovie } = await import('./movies.js');

describe('Movies Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            user: { _id: 'user123' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('deleteMovie', () => {
        it('should delete a movie successfully', async () => {
            req.params.id = 'movie123';
            mockMovie.findByIdAndDelete.mockResolvedValue({ _id: 'movie123', title: 'Test Movie' });

            await deleteMovie(req, res);

            expect(mockMovie.findByIdAndDelete).toHaveBeenCalledWith('movie123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Movie deleted successfully",
                deleted: true
            }));
        });

        it('should return 404 if movie not found', async () => {
            req.params.id = 'nonexistent';
            mockMovie.findByIdAndDelete.mockResolvedValue(null);

            await deleteMovie(req, res);

            expect(mockMovie.findByIdAndDelete).toHaveBeenCalledWith('nonexistent');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Movie not found",
                deleted: false
            }));
        });

        it('should return 500 on server error', async () => {
            req.params.id = 'movie123';
            mockMovie.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            await deleteMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining("Server error"),
                deleted: false
            }));
        });
    });
});
