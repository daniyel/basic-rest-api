import { Controller, Get, Post, Delete, Put, BodyParams, Required, PathParams, Status, ContentType } from '@tsed/common';
import { User } from '../entity/User';
import { NotFound, BadRequest, InternalServerError } from 'ts-httpexceptions';
import { UserService } from '../services/UserService';
import { Produces } from '@tsed/swagger';
import { DeleteResult } from 'typeorm';

@Controller('/users')
export class UserCtrl {

    constructor(private userService: UserService) {

    }

    @Get('/:id')
    @ContentType('application/json')
    @Produces('application/json')
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
    async delete(
        @PathParams('id') id: number
    ): Promise<DeleteResult> {

        if (isNaN(+id)) {
            throw new BadRequest('id not a number');
        }

        try {
            return await this.userService.delete(id);
        } catch (err) {
            throw new InternalServerError(err.message);
        }
    }
}
