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

describe('POST /users/login', () => {
    it('login with valid data of a registered user', async () => {
        const res = await request(app)
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            });
        expect(res.statusCode).toEqual(204);

        let setCookies = res.get('Set-cookie');
        let regex = /([\w|.]*)=[^;]*;\s*path=\/;\s*httponly/;
        expect(setCookies.length).toEqual(2);
        for (let cookie of setCookies) {
            /**
             * cookie to be set follow desired structure
             * example: [
                 'session=eyJsb2dnZWRpbiI6dHJ1ZSwiaWQiOjIsImFjY291bnRfdHlwZSI6ImNpdGl6ZW4ifQ==; path=/; httponly',
                 'session.sig=-asnx2H39OHRmq3Q7INU0MUpFbk; path=/; httponly'
                 ]
             */
            expect(regex.test(cookie)).toBeTruthy();
            // only session and session.sig cookies are set after a successful login
            expect(['session', 'session.sig']).toContain(regex.exec(cookie)[1]);
        }
    });
    it('login with invalid data', async () => {
        const res = await request(app)
            .post('/v2/users/login')
            .send({
                email: "asd@notAValidMail.com",
                password: "zxcvb"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.get('Set-cookie')).toBeUndefined();
    });
});

describe('GET /users/data', () => {
    it('try get data after successful login (citizen)', async () => {
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
                    .get('/v2/users/data')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try get data after successful login (authority)', async () => {
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
                    .get('/v2/users/data')
            });
        expect(res.statusCode).toEqual(200);
        expect(res.get('content-type')).toEqual('application/json');
    });
    it('try get data without login', async () => {
        const res = await request(app)
            .get('/v2/users/data');
        expect(res.statusCode).toEqual(401);
    });
});

describe('POST /users/logout', () => {
    it('logout after successful login', async () => {
        // use same agent session for both requests
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent.post('/v2/users/logout')
            });
        expect(res.statusCode).toEqual(204);
    });
    it('logout without a proper login', async () => {
        const res = await request(app)
            .post('/v2/users/logout');
        expect(res.statusCode).toEqual(400);
    });
});