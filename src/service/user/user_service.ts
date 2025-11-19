import { Response } from 'express';

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export class UserService {
    // 假数据存储
    private users: User[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            createdAt: new Date('2023-01-01T00:00:00Z')
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            createdAt: new Date('2023-02-01T00:00:00Z')
        },
        {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            createdAt: new Date('2023-03-01T00:00:00Z')
        }
    ];

    // 获取所有用户
    public async getAllUsers(): Promise<User[]> {
        // 模拟异步操作
        return new Promise(resolve => {
            setTimeout(() => resolve([...this.users]), 10);
        });
    }

    // 根据ID获取用户
    public async getUserById(id: string): Promise<User | null> {
        // 模拟异步操作
        return new Promise(resolve => {
            setTimeout(() => {
                const user = this.users.find(u => u.id === id);
                resolve(user || null);
            }, 10);
        });
    }

    // 创建用户
    public async createUser(userData: Partial<User>): Promise<User> {
        // 模拟异步操作
        return new Promise(resolve => {
            setTimeout(() => {
                const newUser: User = {
                    id: String(this.users.length + 1),
                    name: userData.name || '',
                    email: userData.email || '',
                    createdAt: new Date()
                };
                
                this.users.push(newUser);
                resolve(newUser);
            }, 10);
        });
    }

    // 更新用户
    public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        // 模拟异步操作
        return new Promise(resolve => {
            setTimeout(() => {
                const userIndex = this.users.findIndex(u => u.id === id);
                if (userIndex === -1) {
                    resolve(null);
                    return;
                }
                
                // 更新用户信息
                this.users[userIndex] = {
                    ...this.users[userIndex],
                    ...userData
                };
                
                resolve(this.users[userIndex]);
            }, 10);
        });
    }

    // 删除用户
    public async deleteUser(id: string): Promise<boolean> {
        // 模拟异步操作
        return new Promise(resolve => {
            setTimeout(() => {
                const initialLength = this.users.length;
                this.users = this.users.filter(u => u.id !== id);
                resolve(this.users.length < initialLength);
            }, 10);
        });
    }
}