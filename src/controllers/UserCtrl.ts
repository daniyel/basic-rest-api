import { Controller, Get, Post, Delete, Put, BodyParams, Required, PathParams, Status, ContentType } from '@tsed/common';
import { User } from '../entity/User';
import { NotFound, BadRequest, InternalServerError } from 'ts-httpexceptions';
import { UserService } from '../services/UserService';
import { Produces, Returns } from '@tsed/swagger';
import { ResponseError } from '../models/ResponseError';

@Controller('/users')
export class UserCtrl {

    constructor(private userService: UserService) {

    }

    @Get('/:id')
    @ContentType('application/json')
    @Produces('application/json')
    @Returns(400, { description: 'Bad Request', type: ResponseError })
    @Returns(404, { description: 'Not Found', type: ResponseError })
    async read(
        @PathParams('id') id: number
    ): Promise<User> {

        let user;

        if (isNaN(+id)) {
            throw new BadRequest('id not a number');
        }

        try {
            user = await this.userService.findOne(id);
        } catch (err) {
            throw new InternalServerError(err.message);
        }

        if (!user) {
            throw new NotFound(`User with id ${id} not found`);
        }

        return user;
    }

    @Post('')
    @ContentType('application/json')
    @Produces('application/json')
    @Returns(500, { description: 'Internal Server Error', type: ResponseError })
    async create(
        @Required() @BodyParams() user: User
    ): Promise<User> {

        try {
            return await this.userService.create(user);
        } catch (err) {
            throw new InternalServerError(err.message);
        }
    }

    @Put('/:id')
    @ContentType('application/json')
    @Produces('application/json')
    @Returns(400, { description: 'Bad Request', type: ResponseError })
    @Returns(404, { description: 'Not Found', type: ResponseError })
    async update(
        @PathParams('id') id: number,
        @Required() @BodyParams() user: User
    ): Promise<User> {

        if (isNaN(+id)) {
            throw new BadRequest('id not a number');
        }

        let updatedUser;

        try {
            updatedUser = await this.userService.update(id, user);
        } catch (err) {
            throw new InternalServerError(err.message);
        }

        if (!updatedUser) {
            throw new NotFound(`User with id ${id} not found`);
        }

        return updatedUser;
    }

    @Delete('/:id')
    @Status(204)
    @ContentType('application/json')
    @Returns(404, { description: 'Not Found', type: ResponseError })
    @Returns(500, { description: 'Internal Server Error', type: ResponseError })
    async delete(
        @PathParams('id') id: number
    ): Promise<any> {

        let result;

        if (isNaN(+id)) {
            throw new BadRequest('id not a number');
        }

        try {
            result = await this.userService.delete(id);
        } catch (err) {
            throw new InternalServerError(err.message);
        }

        if (!result) {
            throw new NotFound(`User with id ${id} not found`);
        }

        return result;
    }
}
