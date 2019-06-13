import { TestContext } from '@tsed/testing';
import * as Sinon from 'sinon';
import { UserService } from '../services/UserService';
import { UserCtrl } from './UserCtrl';
import { NotFound, InternalServerError } from 'ts-httpexceptions';
import 'mocha';

describe('UserCtrl', () => {
    describe('read()', () => {
        describe('without IOC', () => {
            it('should do something', () => {
                const userCtrl: any = new UserCtrl(new UserService());
                userCtrl.should.an.instanceof(UserCtrl);
            });
        });

        describe('via TestContext to mock other service', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should return a result from mocked service', async () => {
                // GIVEN
                const userService: any = {
                    findOne: Sinon.stub().resolves({
                        email: 'john.doe@example.org',
                        givenName: 'John',
                        familyName: 'Doe',
                        created: '2019-06-04T08:16:34.000Z'
                    })
                };

                const userCtrl = await TestContext.invoke(UserCtrl, [{
                    provide: UserService,
                    use: userService
                }]);

                // WHEN
                const result = await userCtrl.read(1);

                // THEN
                result.should.deep.equal({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });
                userService.findOne.should.be.calledWithExactly(1);

                userCtrl.should.be.an.instanceof(UserCtrl);
                userCtrl.userService.should.deep.equal(userService);
            });
        });

        describe('when user is not found', () => {
            it('should throw error', () => {
                before(() => TestContext.create());
                after(() => TestContext.reset());

                it('should return a result from mocked service', async () => {
                    // GIVEN
                    const userService: any = {
                        findOne: Sinon.stub().rejects(null)
                    };

                    const userCtrl = await TestContext.invoke(UserCtrl, [{
                        provide: UserService,
                        use: userService
                    }]);

                    // WHEN
                    let actualError;
                    try {
                        await userCtrl.read(1);
                    } catch (er) {
                        actualError = er;
                    }

                    // THEN
                    actualError.should.be.instanceof(NotFound);
                    userService.findOne.should.be.calledWithExactly(1);
                });
            });
        });
    });

    describe('create()', () => {
        describe('via TestContext to mock other service', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should return a result from mocked service', async () => {
                // GIVEN
                const userService: any = {
                    create: Sinon.stub().resolves({
                        email: 'john.doe@example.org',
                        givenName: 'John',
                        familyName: 'Doe',
                        created: '2019-06-04T08:16:34.000Z'
                    })
                };

                const userCtrl = await TestContext.invoke(UserCtrl, [{
                    provide: UserService,
                    use: userService
                }]);

                // WHEN
                const result = await userCtrl.create({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });

                // THEN
                result.should.deep.equal({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });
                userService.create.should.be.calledWithExactly({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });

                userCtrl.should.be.an.instanceof(UserCtrl);
                userCtrl.userService.should.deep.equal(userService);
            });
        });

        describe('when user is not created', () => {
            it('should throw error', () => {
                before(() => TestContext.create());
                after(() => TestContext.reset());

                it('should return a result from mocked service', async () => {
                    // GIVEN
                    const userService: any = {
                        findOne: Sinon.stub().rejects(null)
                    };

                    const userCtrl = await TestContext.invoke(UserCtrl, [{
                        provide: UserService,
                        use: userService
                    }]);

                    // WHEN
                    let actualError;
                    try {
                        await userCtrl.create({
                            email: 'john.doe@example.org',
                            givenName: 'John',
                            familyName: 'Doe',
                            created: '2019-06-04T08:16:34.000Z'
                        });
                    } catch (er) {
                        actualError = er;
                    }

                    // THEN
                    actualError.should.be.instanceof(InternalServerError);
                    userService.create.should.be.calledWithExactly({
                        email: 'john.doe@example.org',
                        givenName: 'John',
                        familyName: 'Doe',
                        created: '2019-06-04T08:16:34.000Z'
                    });
                });
            });
        });
    })
});
