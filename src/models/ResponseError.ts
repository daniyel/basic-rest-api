import { Property, Required } from '@tsed/common';

export class ResponseError {

    @Property()
    @Required()
    status: number;

    @Property()
    @Required()
    message: string;

    @Property()
    @Required()
    stack: string;

    @Property()
    origin: string;
}
