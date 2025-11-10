import { ResponseMsg } from "../../model/response";
import { BaseController } from "../base_controller";
import { Request, Response } from 'express';

export class UserController extends BaseController {
    constructor() {
        super('/users');
    }

    protected initRoutes(): void {
        this.router.get('/', this.getAllUsers);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.createUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        ResponseMsg.success(res, 'Get all users', {}).send();
    }

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        ResponseMsg.success(res, `Get user ${req.params.id}`, {}).send();
    }

    public createUser = async (req: Request, res: Response): Promise<void> => {
        res.status(201).json({ message: 'User created' });
    }

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        res.json({ message: `User ${req.params.id} updated` });
    }

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        res.json({ message: `User ${req.params.id} deleted` });
    }
}