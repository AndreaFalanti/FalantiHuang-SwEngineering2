const request = require('supertest');
const app = require('../index').app;
const path = require('path');

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

describe('POST /reports/photo_upload', () => {
    let testPhotoPath = path.join(process.cwd(), 'other', 'test_data', 'licensePlateTest.jpg');
    it('try sending a photo for the license plate recognition with a logged citizen account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/photo_upload')
                    .attach('photo', testPhotoPath)
            });
        expect(res.statusCode).toEqual(200);
    });
    it('try sending a photo for the license plate recognition without a proper login', async () => {
        const res = await request(app)
            .post('/v2/reports/photo_upload')
            .attach('photo', testPhotoPath);

        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try sending a photo for the license plate recognition with a non citizen account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@poliziamilano.it",
                password: "qwerty789"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/photo_upload')
                    .attach('photo', testPhotoPath)
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
});