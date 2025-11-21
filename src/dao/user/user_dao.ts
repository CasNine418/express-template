import { DataSource, Repository } from 'typeorm';
import { User } from '../../model/orm/entity/user';
import { Log } from '../../model/log';

const log = new Log('user_dao');

export class UserDAO {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(User);
    }

    /**
     * 获取所有用户
     */
    public async getAllUsers(): Promise<User[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            log.error('Failed to get all users:', error);
            throw error;
        }
    }

    /**
     * 根据ID获取用户
     * @param id 用户ID
     */
    public async getUserById(id: number): Promise<User | null> {
        try {
            return await this.userRepository.findOneBy({ id });
        } catch (error) {
            log.error(`Failed to get user by id ${id}:`, error);
            throw error;
        }
    }

    /**
     * 创建新用户
     * @param userData 用户数据
     */
    public async createUser(userData: Partial<User>): Promise<User> {
        try {
            const user = this.userRepository.create(userData);
            user.updatedAt = new Date();
            return await this.userRepository.save(user);
        } catch (error) {
            log.error('Failed to create user:', error);
            throw error;
        }
    }

    /**
     * 更新用户
     * @param id 用户ID
     * @param userData 要更新的数据
     */
    public async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                return null;
            }

            // 更新字段
            Object.assign(user, userData);
            user.updatedAt = new Date();

            return await this.userRepository.save(user);
        } catch (error) {
            log.error(`Failed to update user ${id}:`, error);
            throw error;
        }
    }

    /**
     * 删除用户
     * @param id 用户ID
     */
    public async deleteUser(id: number): Promise<boolean> {
        try {
            const result = await this.userRepository.delete(id);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            log.error(`Failed to delete user ${id}:`, error);
            throw error;
        }
    }
}