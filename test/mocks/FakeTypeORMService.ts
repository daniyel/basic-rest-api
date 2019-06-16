import { ConnectionOptions, BaseEntity } from 'typeorm';


export const mockedRepository = {
    find: () => {},
    findOne: (id: number) => {
        if (id === 1) {
            return Object.assign(this.entity, {
                id,
                created: '2019-06-04T08:16:34.000Z',
                remove: () => {
                    return Object.assign(this.entity, {
                        id: undefined,
                        created: '2019-06-04T08:16:34.000Z'
                    });
                }
            });
        } else {
            return null;
        }
    },
    update: (id: number, entity: BaseEntity) => {
        return Object.assign(entity, {
            id,
            created: '2019-06-04T08:16:34.000Z'
        });
    },
    delete: () => {
        return true;
    },
    save: (entity: BaseEntity) => {
        this.entity = entity;
        return Object.assign(entity, {
            id: Math.random(),
            created: '2019-06-04T08:16:34.000Z'
        });
    }
};

const createFakeTypeORMService: any = () => {
    return {
        get: () => {
            return {
                getRepository: () => {
                    return mockedRepository;
                }
            };
        },
        instances: new Map(),
        createConnection: (id: string, settings: ConnectionOptions) => {
            this.id = id;
            this.settings = settings;
        },
        has: (id: string) => {
            return (id || true);
        },
        closeConnections: () => {}
    };
};

export default createFakeTypeORMService;
