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
    it('Search a user by id', () => {
        dataLayer.queryUserById(0)
            .then(user => {
                expect(user).toEqual({
                    "id": 0,
                    "email": "andrea.falanti@safestreets.com",
                    "firstname": "Andrea",
                    "lastname": "Falanti",
                    "password": "qwerty123",
                    "organization_id": 0
                })
            })
    });
    it('Search a user by email', () => {
        dataLayer.queryUserByEmail("asd@gmail.com")
            .then(user => {
                expect(user).toEqual({
                    "id": 2,
                    "email": "asd@gmail.com",
                    "firstname": "Johnny",
                    "lastname": "De Gennaro",
                    "password": "qwerty456",
                    "organization_id": null
                })
            })
    });
    it('Search a user by email and password', () => {
        dataLayer.queryUserByPasswordAndEmail("qwerty456", "asd@gmail.com")
            .then(user => {
                expect(user).toEqual({
                    "id": 2,
                    "email": "asd@gmail.com",
                    "firstname": "Johnny",
                    "lastname": "De Gennaro",
                    "password": "qwerty456",
                    "organization_id": null
                })
            })
    });
    it('Insert new user into the database', () => {
        dataLayer.insertUserInDb({
            "id": 7,
            "firstname": "Ajeje",
            "lastname": "Brazorf",
            "email": "asd3@gmail.com",
            "password": "qwerty456",
            "organization_id": null
        })
            .then(() => {
                dataLayer.queryUserByEmail("asd3@gmail.com")
                    .then(user => {
                        expect(user).toEqual({
                            "id": 7,
                            "firstname": "Ajeje",
                            "lastname": "Brazorf",
                            "email": "asd3@gmail.com",
                            "password": "qwerty456",
                            "organization_id": null
                        })
                    })
            })
    });
});

describe('Queries on organization table', () => {
    it('get organization data needed in user profile, by provided id', () => {
        dataLayer.queryOrganizationByIdForUserProfile(1)
            .then(orgData => {
                expect(orgData).toEqual({
                    name: "Polizia locale di Milano",
                    type: "authority",
                    city_name: "Milano"
                })
            })
    });
    it('Search an organization by its id', () => {
        dataLayer.queryOrganizationById(1)
            .then(orgData => {
                expect(orgData).toEqual({
                    "id": 1,
                    "name": "Polizia locale di Milano",
                    "domain": "poliziamilano.it",
                    "type": "authority",
                    "city_id": 0
                })
            })
    });
    it('Search an organization by its domain', () => {
        dataLayer.queryOrganizationByDomain("poliziavarese.it")
            .then(orgData => {
                expect(orgData).toEqual({
                    "id": 2,
                    "name": "Polizia locale di Varese",
                    "domain": "poliziavarese.it",
                    "type": "authority",
                    "city_id": 2
                })
            })
    });
    it('Insert new organization into the database', () => {
        dataLayer.insertOrganizationInDb({
            "id": 3,
            "name": "Polizia locale di Como",
            "domain": "poliziacomo.it",
            "type": "authority",
            "city_id": 1
        })
            .then(() => {
                dataLayer.queryOrganizationByDomain("poliziacomo.it")
                    .then(organization => {
                        expect(organization).toEqual({
                            "id": 3,
                            "name": "Polizia locale di Como",
                            "domain": "poliziacomo.it",
                            "type": "authority",
                            "city_id": 1
                        })
                    })
            })
    });
});

describe('Queries on city table', () => {
    it('Get all cities registered in database', () => {
        dataLayer.queryAllCities()
            .then(cities => {
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
            })
    });
    it('Get a city given its name and region', () => {
        dataLayer.queryCityByNameAndRegion("Varese", "Lombardia")
            .then(city => {
                expect(city).toEqual({
                    "id": 2,
                    "name": "Varese",
                    "region": "Lombardia"
                })
            })
    });
    it('Insert new city into the database', () => {
        dataLayer.insertCityInDb({
            "id": 3,
            "name": "Casalpusterlengo",
            "region": "Lombardia"
        })
            .then(() => {
                dataLayer.queryAllCities()
                    .then(cities => {
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
                    })
            })
    });
});

describe('Queries on place table', () => {
   it('Get a place given its city id and address', () => {
       dataLayer.queryPlaceByCityAndAddress(0, "Via Camillo Golgi")
           .then(place => {
               expect(place).toEqual({
                   "id": 0,
                   "address": "Via Camillo Golgi",
                   "city_id": 0
               })
           })
   })
});

describe('Queries on location table', () => {
    it('Get a location given its latitude and longitude', () => {
        dataLayer.queryLocationByLatAndLon(45.480658, 9.211220)
            .then(location => {
                expect(location).toEqual({
                    "latitude": 45.480658,
                    "longitude": 9.211220,
                    "place_id": 2
                })
            })
    });
    it('Get city id of a location', () => {
        dataLayer.queryLocationForCityId(45.480658, 9.211220)
            .then(id => {
                expect(id).toEqual(0)
            })
    })
});

describe('Queries on report table', () => {
    it('Update a report tuple with its photo paths', () => {
        let newPhotoPaths = ["aaa", "bbb"];
        dataLayer.updateReportWithPhotoPaths(0, newPhotoPaths)
            .then(() => {
                dataLayer.queryReportById(0)
                    .then(report => expect(report.photos).toEqual(newPhotoPaths))
            })
    });
    it('Update a report tuple with a new status', () => {
        let newStatus = 'invalidated';
        let newSupId = 3;
        dataLayer.updateReportStatus(0, newStatus, newSupId)
            .then(() => {
                dataLayer.queryReportById(0)
                    .then(report => {
                        expect(report.report_status).toEqual(newStatus);
                        expect(report.supervisor_id).toEqual(newSupId);
                    })
            })
    });
    it('Get all report done by a citizen', () => {
        dataLayer.queryReportsBySubmitterId(2)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "id": 0,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "AA000AA",
                        "photos": [
                            "path/0/0.jpg",
                            "path/0/1.jpg",
                            "path/0/2.jpg"
                        ],
                        "report_status": "pending",
                        "violation_type": "double_parking",
                        "latitude": 45.475772,
                        "longitude": 9.234391,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    }
                ])
            })
    });
    it('Get all report in a selected city', () => {
        dataLayer.queryReportsByCityId(0)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "id": 0,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "AA000AA",
                        "photos": [
                            "path/0/0.jpg",
                            "path/0/1.jpg",
                            "path/0/2.jpg"
                        ],
                        "report_status": "pending",
                        "violation_type": "double_parking",
                        "latitude": 45.475772,
                        "longitude": 9.234391,
                        "submitter_id": 2,
                        "supervisor_id": null,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    },
                    {
                        "id": 1,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "BB000AA",
                        "photos": [
                            "path/1/0.jpg",
                            "path/1/1.jpg"
                        ],
                        "report_status": "validated",
                        "violation_type": "bike_lane_parking",
                        "latitude": 45.477570,
                        "longitude": 9.234367,
                        "submitter_id": 5,
                        "supervisor_id": 3,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    }
                ])
            })
    });
    it('Get all report that satisfy filters (partial filters applied)', () => {
        dataLayer.queryReportsForAnalysis(undefined, undefined, 'bike_lane_parking', 0, false)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "id": 1,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "BB000AA",
                        "photos": [
                            "path/1/0.jpg",
                            "path/1/1.jpg"
                        ],
                        "report_status": "validated",
                        "violation_type": "bike_lane_parking",
                        "latitude": 45.477570,
                        "longitude": 9.234367,
                        "submitter_id": 5,
                        "supervisor_id": 3,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    }
                ])
            })
    });
    it('Get all report that satisfy filters (all filters)', () => {
        let from = new Date('2019-12-16T03:24:00');
        let to = new Date('2019-12-20T03:24:00');
        dataLayer.queryReportsForAnalysis(from, to, 'bike_lane_parking', 0, false)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "id": 1,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "BB000AA",
                        "photos": [
                            "path/1/0.jpg",
                            "path/1/1.jpg"
                        ],
                        "report_status": "validated",
                        "violation_type": "bike_lane_parking",
                        "latitude": 45.477570,
                        "longitude": 9.234367,
                        "submitter_id": 5,
                        "supervisor_id": 3,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    }
                ])
            })
    });
    it('Get all report that satisfy filters (only from filter)', () => {
        let from = new Date('2019-12-17');
        dataLayer.queryReportsForAnalysis(from, undefined, undefined, undefined, false)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "id": 0,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "AA000AA",
                        "photos": [
                            "path/0/0.jpg",
                            "path/0/1.jpg",
                            "path/0/2.jpg"
                        ],
                        "report_status": "pending",
                        "violation_type": "double_parking",
                        "latitude": 45.475772,
                        "longitude": 9.234391,
                        "submitter_id": 2,
                        "supervisor_id": null
                    },
                    {
                        "id": 1,
                        "timestamp": "2019-12-17T14:13:00Z",
                        "license_plate": "BB000AA",
                        "photos": [
                            "path/1/0.jpg",
                            "path/1/1.jpg"
                        ],
                        "report_status": "validated",
                        "violation_type": "bike_lane_parking",
                        "latitude": 45.477570,
                        "longitude": 9.234367,
                        "submitter_id": 5,
                        "supervisor_id": 3,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    }
                ])
            })
    });
    it('Get all report that satisfy filters (only from filter)', () => {
        let to = new Date('2019-12-17');
        dataLayer.queryReportsForAnalysis(undefined, to, undefined, undefined, false)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "id": 2,
                        "timestamp": "2019-12-16T14:53:00Z",
                        "license_plate": "BB000AA",
                        "photos": [
                            "path/3/0.jpg"
                        ],
                        "report_status": "validated",
                        "violation_type": "invalid_handicap_parking",
                        "latitude": 45.809325,
                        "longitude": 8.836170,
                        "submitter_id": 6,
                        "supervisor_id": 4
                    }
                ])
            })
    });
    it('Get all report that satisfy filters (all filters, citizen restrictions)', () => {
        let from = new Date('2019-12-16T03:24:00');
        let to = new Date('2019-12-20T03:24:00');
        dataLayer.queryReportsForAnalysis(from, to, 'bike_lane_parking', 0, true)
            .then(reports => {
                expect(reports).toEqual([
                    {
                        "timestamp": "2019-12-17T14:13:00Z",
                        "report_status": "validated",
                        "violation_type": "bike_lane_parking",
                        "latitude": 45.477570,
                        "longitude": 9.234367,
                        "place": "Via Camillo Golgi",
                        "city": "Milano"
                    }
                ])
            })
    });
});