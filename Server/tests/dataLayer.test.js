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
    it('get organization type, by provided id', () => {
        dataLayer.queryOrganizationByIdForItsType(1)
            .then(orgData => {
                expect(orgData).toEqual({
                    type: "authority"
                })
            })
    });
    it('search an organization by its domain', () => {
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
                    .then(user => {
                        expect(user).toEqual({
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
    it('get all cities registered in database', () => {
        dataLayer.queryAllCities()
            .then(orgData => {
                expect(orgData).toEqual([
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
    it('Insert new city into the database', () => {
        dataLayer.insertCityInDb({
            "id": 3,
            "name": "Casalpusterlengo",
            "region": "Lombardia"
        })
            .then(() => {
                dataLayer.queryAllCities()
                    .then(orgData => {
                        expect(orgData).toEqual([
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