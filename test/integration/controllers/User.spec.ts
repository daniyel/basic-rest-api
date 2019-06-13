import { ExpressApplication } from '@tsed/common';
import { TestContext } from '@tsed/testing';
import { expect } from 'chai';
import supertest from 'supertest';
import * as typeorm from 'typeorm';
import { Server } from '../../../src/Server';
import { stub, createStubInstance, createSandbox } from 'sinon';

import 'mocha';

const createFakeRepository = () => {
    return {
        find: () => {},
        findOne: (id: number) => {
            // others
            return {
                email: 'john.doe@example.org',
                givenName: 'John',
                familyName: 'Doe',
                created: '2019-06-04T08:16:34.000Z'
            }
        }
    }
}

const fakeRepository: any = createFakeRepository();
const connection: any = createStubInstance(typeorm.Connection, {
    getRepository: fakeRepository
});

stub(typeorm, 'createConnection').returns(connection);

describe('User', () => {
    let request;
    // bootstrap your expressApplication in first
    before(TestContext.bootstrap(Server));
    before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
        request = supertest(expressApplication);
    }));
    after(TestContext.reset);

    // then run your test
    describe('GET /api/users/:id', () => {
        it('should return user', async () => {
            const response = await request.get('/api/users/1').expect(200);

            expect(response.body).to.be.an('object');
        });
    });

    // then run your test
    describe('GET /api/users/:id with invalid param', () => {
        it('should return user', async () => {
            const response = await request.get('/api/users/zz').expect(400);

            expect(response.body).to.be.an('object');
        });
    });
});