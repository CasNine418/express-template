import { UserController } from '../../../api/user/user_controller';
import { ResponseMsg } from '../../../model/response';
import { Request, Response } from 'express';

jest.mock('../../../model/response');

describe('UserController', () => {
    let userController: UserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJsonMock: jest.Mock;
    let responseStatusMock: jest.Mock;

    beforeEach(() => {
        userController = new UserController();

        // Mock response methods
        responseJsonMock = jest.fn();
        responseStatusMock = jest.fn().mockImplementation(() => ({
            json: responseJsonMock
        }));

        mockRequest = {
            params: {},
            body: {}
        };

        mockResponse = {
            status: responseStatusMock,
            json: responseJsonMock
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users successfully', async () => {
            // Mock the success method of ResponseMsg
            (ResponseMsg.success as jest.Mock).mockImplementation((res, message, data) => {
                return new (class {
                    send() {
                        res.status(200).json({ status: 200, message, data, meta: {} });
                    }
                })();
            });

            await userController.getAllUsers(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.success).toHaveBeenCalledWith(
                mockResponse,
                'Get all users',
                expect.any(Array)
            );
        });
    });

    describe('getUserById', () => {
        it('should return user by id successfully', async () => {
            mockRequest.params = { id: '1' };

            // Mock the success method of ResponseMsg
            (ResponseMsg.success as jest.Mock).mockImplementation((res, message, data) => {
                return new (class {
                    send() {
                        res.status(200).json({ status: 200, message, data, meta: {} });
                    }
                })();
            });

            await userController.getUserById(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.success).toHaveBeenCalledWith(
                mockResponse,
                'Get user 1',
                expect.any(Object)
            );
        });

        it('should return 404 when user is not found', async () => {
            mockRequest.params = { id: '999' };
            
            // Mock ResponseMsg.new method
            const mockResponseMsg = {
                setStatus: jest.fn().mockReturnThis(),
                setMessage: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            (ResponseMsg.new as jest.Mock).mockReturnValue(mockResponseMsg);

            await userController.getUserById(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.new).toHaveBeenCalledWith(mockResponse);
            expect(mockResponseMsg.setStatus).toHaveBeenCalledWith(404);
            expect(mockResponseMsg.setMessage).toHaveBeenCalledWith('User not found');
            expect(mockResponseMsg.send).toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            mockRequest.body = { name: 'Test User', email: 'test@example.com' };

            // Mock ResponseMsg.new method
            const mockResponseMsg = {
                setStatus: jest.fn().mockReturnThis(),
                setMessage: jest.fn().mockReturnThis(),
                setData: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            (ResponseMsg.new as jest.Mock).mockReturnValue(mockResponseMsg);

            await userController.createUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.new).toHaveBeenCalledWith(mockResponse);
            expect(mockResponseMsg.setStatus).toHaveBeenCalledWith(201);
            expect(mockResponseMsg.setMessage).toHaveBeenCalledWith('User created');
            expect(mockResponseMsg.setData).toHaveBeenCalled();
            expect(mockResponseMsg.send).toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { name: 'Updated User' };

            // Mock the success method of ResponseMsg
            (ResponseMsg.success as jest.Mock).mockImplementation((res, message, data) => {
                return new (class {
                    send() {
                        res.status(200).json({ status: 200, message, data, meta: {} });
                    }
                })();
            });

            await userController.updateUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.success).toHaveBeenCalledWith(
                mockResponse,
                'User 1 updated',
                expect.any(Object)
            );
        });

        it('should return 404 when trying to update non-existent user', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { name: 'Updated User' };
            
            // Mock ResponseMsg.new method
            const mockResponseMsg = {
                setStatus: jest.fn().mockReturnThis(),
                setMessage: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            (ResponseMsg.new as jest.Mock).mockReturnValue(mockResponseMsg);

            await userController.updateUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.new).toHaveBeenCalledWith(mockResponse);
            expect(mockResponseMsg.setStatus).toHaveBeenCalledWith(404);
            expect(mockResponseMsg.setMessage).toHaveBeenCalledWith('User not found');
            expect(mockResponseMsg.send).toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            mockRequest.params = { id: '1' };

            // Mock the success method of ResponseMsg
            (ResponseMsg.success as jest.Mock).mockImplementation((res, message, data) => {
                return new (class {
                    send() {
                        res.status(200).json({ status: 200, message, data, meta: {} });
                    }
                })();
            });

            await userController.deleteUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.success).toHaveBeenCalledWith(
                mockResponse,
                'User 1 deleted',
                {}
            );
        });

        it('should return 404 when trying to delete non-existent user', async () => {
            mockRequest.params = { id: '999' };
            
            // Mock ResponseMsg.new method
            const mockResponseMsg = {
                setStatus: jest.fn().mockReturnThis(),
                setMessage: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            (ResponseMsg.new as jest.Mock).mockReturnValue(mockResponseMsg);

            await userController.deleteUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(ResponseMsg.new).toHaveBeenCalledWith(mockResponse);
            expect(mockResponseMsg.setStatus).toHaveBeenCalledWith(404);
            expect(mockResponseMsg.setMessage).toHaveBeenCalledWith('User not found');
            expect(mockResponseMsg.send).toHaveBeenCalled();
        });
    });
});