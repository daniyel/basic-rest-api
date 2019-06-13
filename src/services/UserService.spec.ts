import { inject } from '@tsed/testing';
import { expect } from 'chai';
import { UserService } from './UserService';

describe('UserService', () => {

    describe('without IOC', () => {
        before(() => {
            this.userService = new UserService();
        });

        it('should do something', () => {
            expect(this.userService).to.be.an.instanceof(UserService);
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