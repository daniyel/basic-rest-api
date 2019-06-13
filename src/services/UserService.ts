import { Service, AfterRoutesInit } from '@tsed/common';
import { createConnection, Connection, DeleteResult } from 'typeorm';
import { User } from '../entity/User';
import { TypeORMService } from '@tsed/typeorm';

@Service()
export class UserService implements AfterRoutesInit {
    private connection: Connection;

    constructor() {
    }

    async $afterRoutesInit() {
        this.connection = await createConnection();
    }

    async create(user: User): Promise<User> {
        const userRepository = await this.connection.getRepository(User);

        return await userRepository.save(user);
    }

    async findOne(id: number): Promise<User> {
        const user = await this.connection.getRepository(User).findOne(id);

        return user || null;
    }

    async update(id: number, user: User): Promise<User> {
        const savedUser = await this.findOne(id);

        if (savedUser) {
            savedUser.email = user.email || savedUser.email;
            savedUser.givenName = user.givenName || savedUser.givenName;
            savedUser.familyName = user.familyName || savedUser.familyName;

            await this.connection.getRepository(User).update(id, savedUser);
        }

        return savedUser;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.connection.getRepository(User).delete(id);
    }
}
