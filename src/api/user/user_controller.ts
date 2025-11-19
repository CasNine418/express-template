import { ResponseMsg } from "../../model/response";
import { BaseController } from "../base_controller";
import { Request, Response } from 'express';
import { UserService, User } from '../../service/user/user_service';

export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super('/users');
        this.userService = new UserService();
    }

    protected initRoutes(): void {
        this.router.get('/', this.getAllUsers);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.createUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            ResponseMsg.success(res, 'Get all users', users).send();
        } catch (error) {
            ResponseMsg.new(res).setStatus(500).setMessage('Failed to get users').send();
        }
    }

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (user) {
                ResponseMsg.success(res, `Get user ${req.params.id}`, user).send();
            } else {
                ResponseMsg.new(res).setStatus(404).setMessage('User not found').send();
            }
        } catch (error) {
            ResponseMsg.new(res).setStatus(500).setMessage('Failed to get user').send();
        }
    }

    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.createUser(req.body);
            ResponseMsg.new(res).setStatus(201).setMessage('User created').setData(user).send();
        } catch (error) {
            ResponseMsg.new(res).setStatus(500).setMessage('Failed to create user').send();
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            if (user) {
                ResponseMsg.success(res, `User ${req.params.id} updated`, user).send();
            } else {
                ResponseMsg.new(res).setStatus(404).setMessage('User not found').send();
            }
        } catch (error) {
            ResponseMsg.new(res).setStatus(500).setMessage('Failed to update user').send();
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.userService.deleteUser(req.params.id);
            if (result) {
                ResponseMsg.success(res, `User ${req.params.id} deleted`, {}).send();
            } else {
                ResponseMsg.new(res).setStatus(404).setMessage('User not found').send();
            }
        } catch (error) {
            ResponseMsg.new(res).setStatus(500).setMessage('Failed to delete user').send();
        }
    }
}