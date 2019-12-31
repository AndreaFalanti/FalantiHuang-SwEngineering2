const request = require('supertest');
const app = require('../index').app;
const path = require('path');
const rimraf = require("rimraf");

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
    let invalidTestPhotoPath = path.join(process.cwd(), 'other', 'test_data', 'strangeCat.jpg');

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
    it('try sending an invalid photo for the license plate recognition with a logged citizen account', async () => {
        let agent = request.agent(app);
        // put a timeout because the OCR service with free plan accepts only one request per second
        setTimeout(async () => {
            const res = await agent
                .post('/v2/users/login')
                .send({
                    email: "asd@gmail.com",
                    password: "qwerty456"
                })
                .then(() => {
                    return agent
                        .post('/v2/reports/photo_upload')
                        .attach('photo', invalidTestPhotoPath)
                });
            expect(res.statusCode).toEqual(400);
            expect(res.res.statusMessage).toEqual("License plate not recognised");
        }, 1000);
    });
});

describe('POST /reports/submit', () => {
    let testPhotoPath = path.join(process.cwd(), 'other', 'test_data', 'licensePlateTest.jpg');
    let invalidTestPhotoPath = path.join(process.cwd(), 'other', 'test_data', 'strangeCat.jpg');

    it('try submitting a report form with a logged citizen account (city, place and location not present in db)',
        async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@gmail.com",
                password: "qwerty456"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/submit')
                    .field('latitude', 41.909116)
                    .field('longitude', 12.455214)
                    .field('violation_type', 'double_parking')
                    .field('license_plate', 'AA000AA')
                    .attach('photo_files', testPhotoPath)
                    .attach('photo_files', invalidTestPhotoPath)
            });
        expect(res.statusCode).toEqual(204);

        // path where the photos will be inserted if test is successful
        let photoFolder = path.join(process.cwd(), 'public', 'reports', '3');
        // remove the folder to avoid problems with further testing or development
        rimraf(photoFolder, () => { console.log("photo folder removed"); });
    });
    it('try submitting a report form with a logged citizen account (only location not present in db)',
        async () => {
            let agent = request.agent(app);
            const res = await agent
                .post('/v2/users/login')
                .send({
                    email: "asd@gmail.com",
                    password: "qwerty456"
                })
                .then(() => {
                    return agent
                        .post('/v2/reports/submit')
                        .field('latitude', 45.802565)   // Viale Luigi Borri, Varese (Lombardia)
                        .field('longitude', 8.842043)
                        .field('violation_type', 'double_parking')
                        .field('license_plate', 'AA000AA')
                        .attach('photo_files', testPhotoPath)
                        .attach('photo_files', invalidTestPhotoPath)
                });
            expect(res.statusCode).toEqual(204);

            // path where the photos will be inserted if test is successful
            let photoFolder = path.join(process.cwd(), 'public', 'reports', '3');
            // remove the folder to avoid problems with further testing or development
            rimraf(photoFolder, () => { console.log("photo folder removed"); });
        });
    it('try submitting a report form with a logged citizen account (place and location not present in db)',
        async () => {
            let agent = request.agent(app);
            const res = await agent
                .post('/v2/users/login')
                .send({
                    email: "asd@gmail.com",
                    password: "qwerty456"
                })
                .then(() => {
                    return agent
                        .post('/v2/reports/submit')
                        .field('latitude', 45.477154)   // Milano (Lombardia)
                        .field('longitude', 9.223922)
                        .field('violation_type', 'invalid_handicap_parking')
                        .field('license_plate', 'AA000AA')
                        .attach('photo_files', testPhotoPath)
                        .attach('photo_files', invalidTestPhotoPath)
                });
            expect(res.statusCode).toEqual(204);

            // path where the photos will be inserted if test is successful
            let photoFolder = path.join(process.cwd(), 'public', 'reports', '3');
            // remove the folder to avoid problems with further testing or development
            rimraf(photoFolder, () => { console.log("photo folder removed"); });
        });
    it('try submitting a report form without a proper login', async () => {
        const res = await request(app)
            .post('/v2/reports/submit')
            .field('latitude', 41.909116)
            .field('longitude', 12.455214)
            .field('violation_type', 'double_parking')
            .field('license_plate', 'AA000AA')
            .attach('photo_files', testPhotoPath)
            .attach('photo_files', invalidTestPhotoPath);

        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Not authenticated");
    });
    it('try submitting a report form with a non citizen account', async () => {
        let agent = request.agent(app);
        const res = await agent
            .post('/v2/users/login')
            .send({
                email: "asd@poliziamilano.it",
                password: "qwerty789"
            })
            .then(() => {
                return agent
                    .post('/v2/reports/submit')
                    .field('latitude', 41.909116)
                    .field('longitude', 12.455214)
                    .field('violation_type', 'double_parking')
                    .field('license_plate', 'AA000AA')
                    .attach('photo_files', testPhotoPath)
                    .attach('photo_files', invalidTestPhotoPath)
            });
        expect(res.statusCode).toEqual(401);
        expect(res.res.statusMessage).toEqual("Insufficient permissions");
    });
});