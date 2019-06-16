import { Service, AfterRoutesInit } from '@tsed/common';
import { Connection, Repository } from 'typeorm';
import { User } from '../entity/User';
import { TypeORMService } from '@tsed/typeorm';

@Service()
export class UserService implements AfterRoutesInit {
    private connection: Connection;

    constructor(private typeORMService: TypeORMService) {
    }

    async $afterRoutesInit() {
        this.connection = this.typeORMService.get();
    }

    async create(user: User): Promise<User> {
        const userRepository: Repository<User> = await this.connection.getRepository(User);

        return await userRepository.save(user);
    }

    async findOne(id: number): Promise<User> {
        const userRepository: Repository<User> = await this.connection.getRepository(User);
        const user: User = await userRepository.findOne(id);

        return user || /* istanbul ignore next */ null;
    }

    async update(id: number, user: User): Promise<User> {
        const savedUser: User = await this.findOne(id);

        /* istanbul ignore else */
        if (savedUser) {
            savedUser.email = user.email;
            savedUser.givenName = user.givenName;
            savedUser.familyName = user.familyName;

            await this.connection.getRepository(User).update(id, savedUser);
        }

        return savedUser;
    }

    async delete(id: number): Promise<User | boolean> {
        /**
         * @see https://github.com/typeorm/typeorm/issues/2415
         *
         * @description Implement delete once the issue with delete is fixed
         */
        const user: User = await this.findOne(id);

        if (user) {
            return await user.remove();
        }

        return false;
    }
}
