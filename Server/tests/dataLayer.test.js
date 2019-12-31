let dataLayer = require("../other/service/DataLayer");

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
beforeEach(async () => {
    return sqlDb.seed.run();
});

describe('Queries on usr table', () => {
    it('Search a user by id', async () => {
        let user = await dataLayer.queryUserById(0);
        expect(user).toEqual({
            "email": "andrea.falanti@safestreets.com",
            "firstname": "Andrea",
            "lastname": "Falanti",
            "organization_id": 0
        });
    });
    it('Search a user by email', async () => {
        let user = await dataLayer.queryUserByEmail("asd@gmail.com");
        expect(user).toEqual({
            "id": 2,
            "email": "asd@gmail.com",
            "firstname": "Johnny",
            "lastname": "De Gennaro",
            "password": "qwerty456",
            "organization_id": null
        })
    });
    it('Search a user by email and password', async () => {
        let user = await dataLayer.queryUserByPasswordAndEmail("qwerty456", "asd@gmail.com");
        expect(user).toEqual({
            "id": 2,
            "email": "asd@gmail.com",
            "firstname": "Johnny",
            "lastname": "De Gennaro",
            "password": "qwerty456",
            "organization_id": null
        })
    });
    it('Insert new user into the database', async () => {
        await dataLayer.insertUserInDb({
            "id": 7,
            "firstname": "Ajeje",
            "lastname": "Brazorf",
            "email": "ajeje@gmail.com",
            "password": "qwerty456",
            "organization_id": null
        });

        let user = await dataLayer.queryUserByEmail("ajeje@gmail.com");
        expect(user).toEqual({
            "id": 7,
            "firstname": "Ajeje",
            "lastname": "Brazorf",
            "email": "ajeje@gmail.com",
            "password": "qwerty456",
            "organization_id": null
        })
    });
});

describe('Queries on organization table', () => {
    it('get organization data needed in user profile, by provided id', async () => {
        let orgData = await dataLayer.queryOrganizationByIdForUserProfile(1);
        expect(orgData).toEqual({
            name: "Polizia locale di Milano",
            type: "authority",
            city_name: "Milano"
        })
    });
    it('Search an organization by its id', async () => {
        let orgData = await dataLayer.queryOrganizationById(1)
        expect(orgData).toEqual({
            "id": 1,
            "name": "Polizia locale di Milano",
            "domain": "poliziamilano.it",
            "type": "authority",
            "city_id": 0
        })
    });
    it('Search an organization by its domain', async () => {
        let orgData = await dataLayer.queryOrganizationByDomain("poliziavarese.it");
        expect(orgData).toEqual({
            "id": 2,
            "name": "Polizia locale di Varese",
            "domain": "poliziavarese.it",
            "type": "authority",
            "city_id": 2
        })
    });
    it('Insert new organization into the database', async () => {
        await dataLayer.insertOrganizationInDb({
            "id": 3,
            "name": "Polizia locale di Como",
            "domain": "poliziacomo.it",
            "type": "authority",
            "city_id": 1
        });
        let organization = await dataLayer.queryOrganizationByDomain("poliziacomo.it");

        expect(organization).toEqual({
            "id": 3,
            "name": "Polizia locale di Como",
            "domain": "poliziacomo.it",
            "type": "authority",
            "city_id": 1
        })
    });
});

describe('Queries on city table', () => {
    it('Get all cities registered in database', async () => {
        let cities = await dataLayer.queryAllCities();
        expect(cities).toEqual([
            {
                "id": 0,
                "name": "Milano",
                "region": "Lombardia"
            },
            {
                "id": 1,
                "name": "Como",
                "region": "Lombardia"
            },
            {
                "id": 2,
                "name": "Varese",
                "region": "Lombardia"
            }
        ])
    });
    it('Get a city given its name and region', async () => {
        let city = await dataLayer.queryCityByNameAndRegion("Varese", "Lombardia");
        expect(city).toEqual({
            "id": 2,
            "name": "Varese",
            "region": "Lombardia"
        })
    });
    it('Insert new city into the database', async () => {
        await dataLayer.insertCityInDb({
            "id": 3,
            "name": "Casalpusterlengo",
            "region": "Lombardia"
        });
        let cities = await dataLayer.queryAllCities();
        expect(cities).toEqual([
            {
                "id": 0,
                "name": "Milano",
                "region": "Lombardia"
            },
            {
                "id": 1,
                "name": "Como",
                "region": "Lombardia"
            },
            {
                "id": 2,
                "name": "Varese",
                "region": "Lombardia"
            },
            {
                "id": 3,
                "name": "Casalpusterlengo",
                "region": "Lombardia"
            }
        ])
    });
});

describe('Queries on place table', () => {
   it('Get a place given its city id and address', async () => {
       let place = await dataLayer.queryPlaceByCityAndAddress(0, "Via Camillo Golgi");
       expect(place).toEqual({
           "id": 0,
           "address": "Via Camillo Golgi",
           "city_id": 0
       })
   })
});

describe('Queries on location table', () => {
    it('Get a location given its latitude and longitude', async () => {
        let location = await dataLayer.queryLocationByLatAndLon(45.480658, 9.211220);
        expect(location).toEqual({
            "latitude": "45.480658",
            "longitude": "9.21122",
            "place_id": 2
        })
    });
    it('Get city id of a location', async () => {
        let obj = await dataLayer.queryLocationForCityId(45.475772, 9.234391);
        expect(obj.city_id).toEqual(0);
    })
});

describe('Queries on report table', () => {
    it('Update a report tuple with its photo paths', async () => {
        let newPhotoPaths = ["aaa", "bbb"];

        await dataLayer.updateReportWithPhotoPaths(0, newPhotoPaths);
        let report = await dataLayer.queryReportById(0);

        expect(report.photos).toEqual(newPhotoPaths)
    });
    it('Update a report tuple with a new status', async () => {
        let newStatus = 'invalidated';
        let newSupId = 3;

        await dataLayer.updateReportStatus(0, newStatus, newSupId);
        let report = await dataLayer.queryReportById(0);

        expect(report.report_status).toEqual(newStatus);
        expect(report.supervisor_id).toEqual(newSupId);
    });
    it('Get all report done by a citizen', async () => {
        let reports = await dataLayer.queryReportsBySubmitterId(2);
        expect(reports).toEqual([
            {
                "id": 0,
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "license_plate": "AA000AA",
                "photos": [
                    "path/0/0.jpg",
                    "path/0/1.jpg",
                    "path/0/2.jpg"
                ],
                "report_status": "pending",
                "violation_type": "double_parking",
                "latitude": 45.475772.toString(),
                "longitude": 9.234391.toString(),
                "place": "Via Camillo Golgi",
                "city": "Milano"
            }
        ])
    });
    it('Get all report in a selected city', async () => {
        let reports = await dataLayer.queryReportsByCityId(0);
        expect(reports).toEqual([
            {
                "id": 0,
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "license_plate": "AA000AA",
                "photos": [
                    "path/0/0.jpg",
                    "path/0/1.jpg",
                    "path/0/2.jpg"
                ],
                "report_status": "pending",
                "violation_type": "double_parking",
                "latitude": 45.475772.toString(),
                "longitude": 9.234391.toString(),
                "submitter_id": 2,
                "supervisor_id": null,
                "place": "Via Camillo Golgi",
                "city": "Milano"
            },
            {
                "id": 1,
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "license_plate": "BB000AA",
                "photos": [
                    "path/1/0.jpg",
                    "path/1/1.jpg"
                ],
                "report_status": "validated",
                "violation_type": "bike_lane_parking",
                "latitude": 45.477570.toString(),
                "longitude": 9.234367.toString(),
                "submitter_id": 5,
                "supervisor_id": 3,
                "place": "Via Camillo Golgi",
                "city": "Milano"
            }
        ])
    });
    it('Get all report that satisfy filters (partial filters applied)', async () => {
        let reports = await dataLayer.queryReportsForAnalysis(undefined, undefined, 'bike_lane_parking',
            0, false);

        expect(reports).toEqual([
            {
                "id": 1,
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "license_plate": "BB000AA",
                "photos": [
                    "path/1/0.jpg",
                    "path/1/1.jpg"
                ],
                "report_status": "validated",
                "violation_type": "bike_lane_parking",
                "latitude": 45.477570.toString(),
                "longitude": 9.234367.toString(),
                "submitter_id": 5,
                "supervisor_id": 3,
                "place": "Via Camillo Golgi",
                "city": "Milano"
            }
        ])
    });
    it('Get all report that satisfy filters (all filters)', async () => {
        let from = new Date('2019-12-16T03:24:00');
        let to = new Date('2019-12-20T03:24:00');

        let reports = await dataLayer.queryReportsForAnalysis(from, to, 'bike_lane_parking', 0, false);
        expect(reports).toEqual([
            {
                "id": 1,
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "license_plate": "BB000AA",
                "photos": [
                    "path/1/0.jpg",
                    "path/1/1.jpg"
                ],
                "report_status": "validated",
                "violation_type": "bike_lane_parking",
                "latitude": 45.477570.toString(),
                "longitude": 9.234367.toString(),
                "submitter_id": 5,
                "supervisor_id": 3,
                "place": "Via Camillo Golgi",
                "city": "Milano"
            }
        ])
    });
    it('Get all report that satisfy filters (only from filter)', async () => {
        let from = new Date('2019-12-17');

        let reports = await dataLayer.queryReportsForAnalysis(from, undefined, undefined, undefined, false);
        expect(reports).toEqual([
            {
                "id": 1,
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "license_plate": "BB000AA",
                "photos": [
                    "path/1/0.jpg",
                    "path/1/1.jpg"
                ],
                "report_status": "validated",
                "violation_type": "bike_lane_parking",
                "latitude": 45.477570.toString(),
                "longitude": 9.234367.toString(),
                "submitter_id": 5,
                "supervisor_id": 3,
                "place": "Via Camillo Golgi",
                "city": "Milano"
            }
        ])
    });
    it('Get all report that satisfy filters (only to filter)', async () => {
        let to = new Date('2019-12-17');
        let reports = await dataLayer.queryReportsForAnalysis(undefined, to, undefined, undefined, false);

        expect(reports).toEqual([
                {
                    "id": 2,
                    "timestamp": new Date("2019-12-16T14:53:00Z"),
                    "license_plate": "BB000AA",
                    "photos": [
                        "path/3/0.jpg"
                    ],
                    "report_status": "validated",
                    "violation_type": "invalid_handicap_parking",
                    "latitude": "45.809325",
                    "longitude": "8.83617",
                    "place": "Viale Luigi Borri",
                    "city": "Varese",
                    "submitter_id": 6,
                    "supervisor_id": 4
                }
        ]);
    });
    it('Get all report that satisfy filters (all filters, citizen restrictions)', async () => {
        let from = new Date('2019-12-16T03:24:00');
        let to = new Date('2019-12-20T03:24:00');

        let reports = await dataLayer.queryReportsForAnalysis(from, to, 'bike_lane_parking', 0, true);
        expect(reports).toEqual([
            {
                "timestamp": new Date("2019-12-17T14:13:00Z"),
                "report_status": "validated",
                "violation_type": "bike_lane_parking",
                "latitude": 45.477570.toString(),
                "longitude": 9.234367.toString(),
                "place": "Via Camillo Golgi",
                "city": "Milano"
            }
        ])
    });
});