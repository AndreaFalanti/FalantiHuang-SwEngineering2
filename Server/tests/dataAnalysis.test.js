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

describe('GET /reports?from=<string>&to=<string>&type=<string>&city=<integer>', () => {
    it('get reports for data analysis, specifying only some filters (authority)', async () => {
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
                    .get('/v2/reports?type=bike_lane_parking&city=0')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('get reports for data analysis, specifying only some filters (citizen)', async () => {
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
                    .get('/v2/reports?type=bike_lane_parking&city=0')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('get reports for data analysis without login', async () => {
        const res = await request(app)
            .get('/v2/reports?type=bike_lane_parking&city=0');
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('get reports for data analysis, specifying all filters (authority)', async () => {
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
                    .get('/v2/reports?from=2019-12-16&to=2019-12-20&type=bike_lane_parking&city=0')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
});