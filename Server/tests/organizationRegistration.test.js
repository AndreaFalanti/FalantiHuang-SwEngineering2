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

describe('GET /admin/cities', () => {
    it('get registered cities data after a login with admin account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "andrea.falanti@safestreets.com",
                password: "qwerty123"
            })
            .then(() => {
                return agent
                    .get('/v2/admin/cities')
            });
        expect(res.statusCode).toEqual(200);
    });
    it('try getting cities data without a proper login', async () => {
        const res = await request(app)
            .get('/v2/admin/cities');
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try getting cities data with a non admin account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent
                    .get('/v2/admin/cities')
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
});

describe('POST /admin/cities/register', () => {
    it('try inserting a city into the database with a logged admin account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "andrea.falanti@safestreets.com",
                password: "qwerty123"
            })
            .then(() => {
                return agent
                    .post('/v2/admin/cities/register')
                    .send({
                        name: "Casalpusterlengo",
                        region: "Lombardia"
                    })
            });
        expect(res.statusCode).toEqual(204);
    });
    it('try inserting a city into the database without a proper login', async () => {
        const res = await request(app)
            .post('/v2/admin/cities/register')
            .send({
                name: "Casalpusterlengo",
                region: "Lombardia"
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try inserting a city into the database with a non admin account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent
                    .post('/v2/admin/cities/register')
                    .send({
                        name: "Casalpusterlengo",
                        region: "Lombardia"
                    })
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
});

describe('POST /admin/organizations/register', () => {
    it('try inserting an organization into the database with a logged admin account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "andrea.falanti@safestreets.com",
                password: "qwerty123"
            })
            .then(() => {
                return agent
                    .post('/v2/admin/organizations/register')
                    .send({
                        city_id: 1,
                        domain: "poliziacomo.it",
                        name: "Polizia locale di Como",
                        type: "authority"
                    })
            });
        expect(res.statusCode).toEqual(204);
    });
    it('try inserting a city into the database without a proper login', async () => {
        const res = await request(app)
            .post('/v2/admin/organizations/register')
            .send({
                city_id: 1,
                domain: "poliziacomo.it",
                name: "Polizia locale di Como",
                type: "authority"
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try inserting a city into the database with a non admin account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent
                    .post('/v2/admin/organizations/register')
                    .send({
                        city_id: 1,
                        domain: "poliziacomo.it",
                        name: "Polizia locale di Como",
                        type: "authority"
                    })
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
});