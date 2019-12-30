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

describe('GET /users/reports', () => {
    it('try to get accessible reports\' data after successful citizen login', async () => {
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
                    .get('/v2/users/reports')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try to get accessible reports\' data after successful authority login', async () => {
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
                    .get('/v2/users/reports')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try to get accessible reports\' data without login', async () => {
        const res = await request(app)
            .get('/v2/users/reports');
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
});

describe('GET /users/reports', () => {
    it('try to get an accessible report after successful citizen login', async () => {
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
                    .get('/v2/reports/0')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try to get an accessible report after successful authority login', async () => {
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
                    .get('/v2/reports/0')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try to get accessible reports\' data without login', async () => {
        const res = await request(app)
            .get('/v2/users/reports');
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try to get a not accessible report after successful citizen login', async () => {
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
                    .get('/v2/reports/1')   // not submitted by him
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
    it('try to get a not accessible report after successful authority login', async () => {
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
                    .get('/v2/reports/2')   // not located in his organization city
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
});