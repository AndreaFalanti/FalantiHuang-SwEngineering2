const request = require('supertest');
const app = require('../index').app;

/**
 * Make sure that the database tables are present and that their schemas are the more recent provided ones
 */
beforeAll(async () => {
    await sqlDb.migrate.rollback();
    await sqlDb.migrate.latest();
});

/**
 * Reset the data of all tables of the database to the seed provided for testing
 * this ensures that the database is always the same at the start of each test, so that the
 * output and the assertions of the tests are not altered by the data contained in the database
 */
beforeEach(() => {
    return sqlDb.seed.run();
});

describe('POST /reports/:id/set_status', () => {
    it('try updating report status after successful authority login (report located in his city)', async () => {
        // use same agent session for both requests
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@poliziamilano.it",
                password: "qwerty789"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/0/set_status')
                    .send({
                        status: "invalidated"
                    })
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try updating report status after successful citizen login', async () => {
        // use same agent session for both requests
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/0/set_status')
                    .send({
                        status: "invalidated"
                    })
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
    it('try updating report status without login', async () => {
        const res = await request(app)
            .post('/v2/reports/0/set_status')
            .send({
                status: "invalidated"
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try updating report status after successful authority login (report not located in his city)', async () => {
        // use same agent session for both requests
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@poliziamilano.it",
                password: "qwerty789"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/2/set_status')
                    .send({
                        status: "invalidated"
                    })
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
    it('try updating report status after successful authority login (report not existing)', async () => {
        // use same agent session for both requests
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@poliziamilano.it",
                password: "qwerty789"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/1337/set_status')
                    .send({
                        status: "invalidated"
                    })
            });
        expect(res.statusCode).toEqual(404);
        expect(res.res.statusMessage).toEqual("Report not found (unknown id)");
    });
});

