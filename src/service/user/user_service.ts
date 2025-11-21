import { Response } from 'express';
import { UserDAO } from '../../dao/user/user_dao';
import { getDataSource } from '../../model/orm/database';
import { User } from '../../model/orm/entity/user';

export class UserService {
    private userDAO: UserDAO;

    constructor() {
        const dataSource = getDataSource();
        this.userDAO = new UserDAO(dataSource);
    }

    // 获取所有用户
    public async getAllUsers(): Promise<User[]> {
        return await this.userDAO.getAllUsers();
    }

    // 根据ID获取用户
    public async getUserById(id: string): Promise<User | null> {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            return null;
        }
        return await this.userDAO.getUserById(numericId);
    }

    // 创建用户
    public async createUser(userData: Partial<User>): Promise<User> {
        return await this.userDAO.createUser(userData);
    }

    // 更新用户
    public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            return null;
        }
        return await this.userDAO.updateUser(numericId, userData);
    }

    // 删除用户
    public async deleteUser(id: string): Promise<boolean> {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            return false;
        }
        return await this.userDAO.deleteUser(numericId);
    }
}