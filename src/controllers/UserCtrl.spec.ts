import { TestContext } from '@tsed/testing';
import * as Sinon from 'sinon';
import { UserService } from '../services/UserService';
import { UserCtrl } from './UserCtrl';
import { NotFound, InternalServerError, BadRequest } from 'ts-httpexceptions';

import 'mocha';
import createFakeTypeORMService from '../../test/mocks/FakeTypeORMService';

describe('UserCtrl', () => {
    describe('read()', () => {
        describe('without IOC', () => {
            it('should do something', () => {
                const userCtrl: any = new UserCtrl(new UserService(createFakeTypeORMService()));
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
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    findOne: Sinon.stub().resolves(null)
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

        describe('when searching for user is not successful', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
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
                actualError.should.be.instanceof(InternalServerError);
                userService.findOne.should.be.calledWithExactly(1);
            });
        });

        describe('when user id is not a number', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
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
                let actualError;
                try {
                    await userCtrl.read('abc');
                } catch (er) {
                    actualError = er;
                }

                // THEN
                actualError.should.be.an.instanceof(BadRequest);
                userCtrl.userService.should.deep.equal(userService);
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
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {

                // GIVEN
                const userService: any = {
                    create: Sinon.stub().rejects(null)
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

    describe('update()', () => {
        describe('via TestContext to mock other service', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should return a result from mocked service', async () => {
                // GIVEN
                const userService: any = {
                    update: Sinon.stub().resolves({
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
                const result = await userCtrl.update(1, {
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
                userService.update.should.be.calledWithExactly(1, {
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });

                userCtrl.should.be.an.instanceof(UserCtrl);
                userCtrl.userService.should.deep.equal(userService);
            });
        });

        describe('when user is not updated', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    update: Sinon.stub().rejects(null)
                };

                const userCtrl = await TestContext.invoke(UserCtrl, [{
                    provide: UserService,
                    use: userService
                }]);

                // WHEN
                let actualError;
                try {
                    await userCtrl.update(1, {
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
                userService.update.should.be.calledWithExactly(1, {
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });
            });
        });

        describe('when user id is not a number', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    update: Sinon.stub().resolves({
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
                let actualError;
                try {
                    await userCtrl.update('abc', {
                        email: 'john.doe@example.org',
                        givenName: 'John',
                        familyName: 'Doe',
                        created: '2019-06-04T08:16:34.000Z'
                    });
                } catch (er) {
                    actualError = er;
                }

                // THEN
                actualError.should.be.an.instanceof(BadRequest);
                userCtrl.userService.should.deep.equal(userService);
            });
        });

        describe('when user is not found', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    update: Sinon.stub().resolves(null)
                };

                const userCtrl = await TestContext.invoke(UserCtrl, [{
                    provide: UserService,
                    use: userService
                }]);

                // WHEN
                let actualError;
                try {
                    await userCtrl.update(1, {
                        email: 'john.doe@example.org',
                        givenName: 'John',
                        familyName: 'Doe',
                        created: '2019-06-04T08:16:34.000Z'
                    });
                } catch (er) {
                    actualError = er;
                }

                // THEN
                actualError.should.be.instanceof(NotFound);
                userService.update.should.be.calledWithExactly(1, {
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });
            });
        });
    });

    describe('delete()', () => {
        describe('via TestContext to mock other service', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should return a result from mocked service', async () => {
                // GIVEN
                const userService: any = {
                    delete: Sinon.stub().resolves({
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
                const result = await userCtrl.delete(1);

                // THEN
                result.should.deep.equal({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe',
                    created: '2019-06-04T08:16:34.000Z'
                });
                userService.delete.should.be.calledWithExactly(1);

                userCtrl.should.be.an.instanceof(UserCtrl);
                userCtrl.userService.should.deep.equal(userService);
            });
        });

        describe('when user is not deleted', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    delete: Sinon.stub().rejects(null)
                };

                const userCtrl = await TestContext.invoke(UserCtrl, [{
                    provide: UserService,
                    use: userService
                }]);

                // WHEN
                let actualError;
                try {
                    await userCtrl.delete(1);
                } catch (er) {
                    actualError = er;
                }

                // THEN
                actualError.should.be.instanceof(InternalServerError);
                userService.delete.should.be.calledWithExactly(1);
            });
        });

        describe('when user id is not a number', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    delete: Sinon.stub().resolves({
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
                let actualError;
                try {
                    await userCtrl.delete('abc');
                } catch (er) {
                    actualError = er;
                }

                // THEN
                actualError.should.be.an.instanceof(BadRequest);
                userCtrl.userService.should.deep.equal(userService);
            });
        });

        describe('when user does not exist', () => {
            before(() => TestContext.create());
            after(() => TestContext.reset());

            it('should throw error', async () => {
                // GIVEN
                const userService: any = {
                    findOne: Sinon.stub().resolves(null),
                    delete: Sinon.stub().resolves(null)
                };

                const userCtrl = await TestContext.invoke(UserCtrl, [{
                    provide: UserService,
                    use: userService
                }]);

                // WHEN
                let actualError;
                try {
                    await userCtrl.delete(1);
                } catch (er) {
                    actualError = er;
                }

                // THEN
                actualError.should.be.an.instanceof(NotFound);
                userCtrl.userService.should.deep.equal(userService);
            });
        });
    });
});
