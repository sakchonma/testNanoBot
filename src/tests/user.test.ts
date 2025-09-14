jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'token'),
}));
import {
    registerProfile,
    loginProfile,
    listUserProfile,
    getUserById,
    updateProfile,
    deleteProfile
} from '../services/user';
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('User Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerProfile', () => {
        it('should return message if user already exists', async () => {
            mockedUserModel.findOne.mockResolvedValue({ email: 'test@test.com' } as any);
            const result = await registerProfile('test', 'test@test.com', 'password');
            expect(result.message).toBe('User already exists');
        });

        it('should create a new user and return data', async () => {
            mockedUserModel.findOne.mockResolvedValue(null as any);
            (mockedBcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            const fakeUser = { _id: '1', username: 'test', email: 'test@test.com', role: 'user' };
            mockedUserModel.create.mockResolvedValue(fakeUser as any);
            jest.mock('jsonwebtoken', () => ({
                sign: jest.fn(() => 'token'),
            }));

            const result = await registerProfile('test', 'test@test.com', 'password');
            expect(result.data?.username).toBe('test');
            expect(result.data?.jwtToken).toBe('token');
        });
    });

    describe('loginProfile', () => {
        it('should throw error if user not found', async () => {
            mockedUserModel.findOne.mockResolvedValue(null as any);
            await expect(loginProfile('noexist@test.com', 'password')).rejects.toEqual('User not found');
        });

        it('should throw error if password is wrong', async () => {
            const fakeUser = { password: 'hashedPassword', _id: '1', username: 'test', email: 'test@test.com', role: 'user' };
            mockedUserModel.findOne.mockResolvedValue(fakeUser as any);
            mockedBcrypt.compareSync.mockReturnValue(false);
            await expect(loginProfile('test@test.com', 'wrongPassword')).rejects.toEqual('Password is wrong');
        });

        it('should login successfully', async () => {
            const fakeUser = { password: 'hashedPassword', _id: '1', username: 'test', email: 'test@test.com', role: 'user' };
            mockedUserModel.findOne.mockResolvedValue(fakeUser as any);
            mockedBcrypt.compareSync.mockReturnValue(true);
            jest.mock('jsonwebtoken', () => ({
                sign: jest.fn(() => 'token'),
            }));
            const result = await loginProfile('test@test.com', 'password');
            expect(result.data.jwtToken).toBe('token');
            expect(result.data.email).toBe('test@test.com');
        });
    });

    describe('listUserProfile', () => {
        it('should return users with pagination', async () => {
            const fakeUsers = [{ _id: '1', username: 'user1', email: 'user1@test.com', role: 'user' }];
            mockedUserModel.find.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(fakeUsers)
            } as any);
            mockedUserModel.countDocuments.mockResolvedValue(1);

            const result = await listUserProfile(1, 10);
            expect(result.data).toEqual(fakeUsers);
            expect(result.pagination.totalPages).toBe(1);
        });
    });

    describe('getUserById', () => {
        it('should return user data if found', async () => {
            const fakeUser = { _id: '1', username: 'test', email: 'test@test.com', role: 'user' };
            mockedUserModel.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(fakeUser)
            } as any);

            const result = await getUserById('1');
            expect(result.data).toEqual(fakeUser);
        });

        it('should throw error if user not found', async () => {
            mockedUserModel.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            } as any);
            await expect(getUserById('1')).rejects.toEqual('User not found');
        });
    });

    describe('updateProfile', () => {
        it('should update user successfully', async () => {
            const updatedUser = { _id: '1', username: 'updated', email: 'test@test.com', role: 'user' };
            mockedUserModel.findOne.mockResolvedValue(null as any);
            mockedUserModel.findByIdAndUpdate.mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedUser)
            } as any);

            const result = await updateProfile('1', { username: 'updated' });
            expect(result.data?.username).toBe('updated');
        });

        it('should throw error if user not found', async () => {
            mockedUserModel.findOne.mockResolvedValue(null as any);
            mockedUserModel.findByIdAndUpdate.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            } as any);
            await expect(updateProfile('1', { username: 'newname' })).rejects.toEqual('User not found');
        });
    });

    describe('deleteProfile', () => {
        it('should throw error if owner deletes self', async () => {
            await expect(deleteProfile('1', '1')).rejects.toEqual('Invalid request: cannot perform this action with your own ID.');
        });

        it('should delete user successfully', async () => {
            const fakeUser = { _id: '2', username: 'user2', email: 'user2@test.com', role: 'user' };
            mockedUserModel.findByIdAndDelete.mockResolvedValue(fakeUser as any);
            const result = await deleteProfile('2', '1');
            expect(result.data.username).toBe('user2');
        });

        it('should throw error if user not found', async () => {
            mockedUserModel.findByIdAndDelete.mockResolvedValue(null as any);
            await expect(deleteProfile('3', '1')).rejects.toEqual('User not found');
        });
    });

});
