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

describe('POST /users/register/citizen', () => {
    it('registering with valid citizen data', async () => {
        const res = await request(app)
            .post('/v2/users/register/citizen')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@gmail.com",
                password: "qwerty456",
                confirmPassword: "qwerty456"
            });
        expect(res.statusCode).toEqual(204);
    });
    it('registering with a domain reserved by an organization', async () => {
        const res = await request(app)
            .post('/v2/users/register/citizen')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@poliziamilano.it",
                password: "qwerty456",
                confirmPassword: "qwerty456"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Registering as citizen with an organization domain");
    });
    it('registering with an already registered email', async () => {
        const res = await request(app)
            .post('/v2/users/register/citizen')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "asd@gmail.com",
                password: "qwerty456",
                confirmPassword: "qwerty456"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Email already taken");
    });
    it('registering with a password mismatch', async () => {
        const res = await request(app)
            .post('/v2/users/register/citizen')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@gmail.com",
                password: "qwerty456",
                confirmPassword: "wrongPW"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Password mismatch");
    });
});

describe('POST /users/register/authority', () => {
    it('registering with valid authority data', async () => {
        const res = await request(app)
            .post('/v2/users/register/authority')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@poliziamilano.it",
                password: "qwerty789",
                confirmPassword: "qwerty789"
            });
        expect(res.statusCode).toEqual(204);
    });
    it('registering with a domain not associated to any organization', async () => {
        const res = await request(app)
            .post('/v2/users/register/authority')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@invaliddomain.it",
                password: "qwerty789",
                confirmPassword: "qwerty789"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Invalid domain");
    });
    it('registering with an already registered email', async () => {
        const res = await request(app)
            .post('/v2/users/register/authority')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "asd@poliziamilano.it",
                password: "qwerty789",
                confirmPassword: "qwerty789"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Email already taken");
    });
    it('registering with a password mismatch (citizen)', async () => {
        const res = await request(app)
            .post('/v2/users/register/citizen')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@gmail.com",
                password: "qwerty789",
                confirmPassword: "wrongPW"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Password mismatch");
    });
    it('registering with a password mismatch (authority)', async () => {
        const res = await request(app)
            .post('/v2/users/register/authority')
            .send({
                firstname: "Ajeje",
                lastname: "Brazorf",
                email: "ajeje@poliziamilano.it",
                password: "qwerty789",
                confirmPassword: "wrongPW"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.res.statusMessage).toEqual("Password mismatch");
    });
});