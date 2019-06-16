import { ExpressApplication } from '@tsed/common';
import { TestContext } from '@tsed/testing';
import { expect } from 'chai';
import supertest from 'supertest';
import * as typeorm from 'typeorm';
import { Server } from '../../../src/Server';
import Sinon, { createStubInstance } from 'sinon';

import { mockedRepository } from '../../mocks/FakeTypeORMService';

import 'mocha';

const sandbox = Sinon.createSandbox();
const createFakeRepository = () => {
    return mockedRepository;
};

const fakeRepository: any = createFakeRepository();
const connection: any = createStubInstance(typeorm.Connection, {
    getRepository: fakeRepository
});

sandbox.stub(typeorm, 'createConnection').returns(connection);

describe('User', () => {
    let request;

    before(TestContext.bootstrap(Server));
    before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
        request = supertest(expressApplication);
    }));
    after(TestContext.reset);
    afterEach(() => sandbox.restore());

    describe('GET /api/users/:id', () => {
        it('should return user', async () => {
            const response = await request.get('/api/users/1')
                .expect(200);

            expect(response.body).to.be.an('object');
        });
    });

    describe('GET /api/users/:id with missing user', () => {
        it('should return error response', async () => {
            const response = await request.get('/api/users/2')
                .expect(404);

            expect(response.body).to.be.an('object');
        });
    });

    describe('GET /api/users/:id with invalid param', () => {
        it('should return error response', async () => {
            const response = await request.get('/api/users/zz')
                .expect(400);

            expect(response.body).to.be.an('object');
        });
    });

    describe('POST /api/users with valid post body', () => {
        it('should return user', async () => {
            const response = await request.post('/api/users')
                .send({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe'
                })
                .expect(200);

            expect(response.body).to.be.an('object');
        });
    });

    describe('POST /api/users with missing body param', () => {
        it('should return error response', async () => {
            const response = await request.post('/api/users')
                .send({
                    email: 'john.doe@example.org',
                    givenName: 'John'
                })
                .expect(400);

            expect(response.body).to.be.an('object');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user', async () => {
            const response = await request.put('/api/users/1')
                .send({
                    email: 'john.doe@example.org',
                    givenName: 'John',
                    familyName: 'Doe'
                })
                .expect(200);

            expect(response.body).to.be.an('object');
        });
    });

    describe('PUT /api/users/:id with missing body param', () => {
        it('should return error response', async () => {
            const response = await request.put('/api/users/1')
                .send({
                    email: 'john.doe@example.org',
                    givenName: 'John'
                })
                .expect(400);

            expect(response.body).to.be.an('object');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user', async () => {
            const response = await request.delete('/api/users/1')
                .expect(204);

            expect(response.body).to.be.an('object');
        });
    });

    describe('DELETE /api/users/:id with missing user', () => {
        it('should return error response', async () => {
            const response = await request.delete('/api/users/2')
                .expect(404);

            expect(response.body).to.be.an('object');
        });
    });
});
