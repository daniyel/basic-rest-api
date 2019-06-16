import { inject } from '@tsed/testing';
import { expect } from 'chai';
import { UserService } from './UserService';

import createFakeTypeORMService from '../../test/mocks/FakeTypeORMService';

describe('UserService', () => {

    describe('without IOC', () => {
        before(async () => {
            this.userService = new UserService(createFakeTypeORMService());
            await this.userService.$afterRoutesInit();
        });

        it('should check instance', () => {
            expect(this.userService).to.be.an.instanceof(UserService);
        });

        it('should call create method', async () => {
            const result = await this.userService.create({
                email: 'john.doe@example.org',
                givenName: 'John',
                familyName: 'Doe'
            });
            expect(result).to.have.property('id');
            expect(result).to.have.property('email');
            expect(result).to.have.property('givenName');
            expect(result).to.have.property('familyName');
            expect(result).to.have.property('created');
        });

        it('should call findOne method', async () => {
            const result = await this.userService.findOne(1);
            expect(result).to.have.property('id');
            expect(result).to.have.property('email');
            expect(result).to.have.property('givenName');
            expect(result).to.have.property('familyName');
            expect(result).to.have.property('created');
        });

        it('should call update method', async () => {
            const result = await this.userService.update(1, {
                email: 'jane.doe@example.org',
                givenName: 'Jane',
                familyName: 'Doe'
            });
            expect(result).to.have.property('id');
            expect(result).to.have.property('email');
            expect(result).to.have.property('givenName');
            expect(result).to.have.property('familyName');
            expect(result).to.have.property('created');
        });

        it('should call delete method', async () => {
            const result = await this.userService.delete(1);
            expect(result).to.have.property('id');
            expect(result).to.have.property('email');
            expect(result).to.have.property('givenName');
            expect(result).to.have.property('familyName');
            expect(result).to.have.property('created');
        });

        it('should return false by deleting, if user not found', async () => {
            const result = await this.userService.delete(2);
            // console.log(result);
            expect(result).to.equal(false);
        });
    });

    describe('with inject()', () => {
        before(inject([UserService], (userService: UserService) => {
            this.userService = userService;
        }));

        it('should get the service from the inject method', () => {
            expect(this.userService).to.be.an.instanceof(UserService);
        });
    });
});
