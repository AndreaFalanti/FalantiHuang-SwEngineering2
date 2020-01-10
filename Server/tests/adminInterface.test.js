const puppeteer = require('puppeteer');
const knex = require('knex');
let knexConfig = require("../knexfile");

let sqlDb = knex(knexConfig[process.env.NODE_ENV]);

let page;
let browser;
const width = 1920;
const height = 1080;
const serverUrl = 'http://localhost:8080/';

/**
 * Make sure that the database tables are present and that their schemas are the more recent provided ones
 */
beforeAll(async () => {
    await sqlDb.migrate.rollback();
    await sqlDb.migrate.latest();

    browser = await puppeteer.launch();
    page = await browser.newPage();
    global.page = page;
    await page.coverage.startJSCoverage();
    await page.setViewport({ width, height });
});

afterAll(() => {
    browser.close();
});

/**
 * Reset the data of all tables of the database to the seed provided for testing
 * this ensures that the database is always the same at the start of each test, so that the
 * output and the assertions of the tests are not altered by the data contained in the database
 */
beforeEach(() => {
    return sqlDb.seed.run();
});

describe('test login into admin panel', () => {
    it('login to admin panel', async () => {
        await page.goto(serverUrl + 'pages/login.html');
        await expect(page).toFillForm('#loginForm', {
            email: 'andrea.falanti@safestreets.com',
            password: 'qwerty123',
        });

        await page.on('response', response => {
            if (response.request().method === 'POST' &&
                response.url === `${serverUrl}v2/users/login`)
            {
                expect(response.status).toEqual(204)
            }
        });
        await expect(page).toClick('button', { text: 'Sign in' });
    });
});

describe('test admin panel operations', () => {
    // login into the interface
    beforeAll(async () => {
        await page.goto(serverUrl + 'pages/login.html');
        await expect(page).toFillForm('#loginForm', {
            email: 'andrea.falanti@safestreets.com',
            password: 'qwerty123',
        });

        await expect(page).toClick('button', { text: 'Sign in' });
    });

    it('insert city using admin panel', async () => {
        await page.goto(serverUrl + 'pages/city.html');
        await expect(page).toFillForm('#registrationForm', {
            name: 'Venezia',
            region: 'Veneto',
        });

        await page.on('response', response => {
            if (response.request().method === 'POST' &&
                response.url === `${serverUrl}v2/admin/cities/register`)
            {
                expect(response.status).toEqual(204)
            }
        });
        await expect(page).toClick('button', { text: 'Register' });
    });
    it('insert organization using admin panel', async () => {
        await page.goto(serverUrl + 'pages/organization.html');
        await expect(page).toFillForm('#registrationForm', {
            name: 'Polizia di Como',
            domain: 'poliziacomo.it',
        });
        await page.select('#orgTypeSelect', 'authority');
        await page.select('#cityIdSelect', '1');

        await page.on('response', response => {
            if (response.request().method === 'POST' &&
                response.url === `${serverUrl}v2/admin/organization/register`)
            {
                expect(response.status).toEqual(204)
            }
        });
        await expect(page).toClick('button', { text: 'Register' });
    });
    it('test logout admin panel', async () => {
        await page.goto(serverUrl + 'pages/organization.html');

        await page.on('response', response => {
            if (response.request().method === 'POST' &&
                response.url === `${serverUrl}v2/users/logout`)
            {
                expect(response.status).toEqual(204)
            }
        });
        await expect(page).toClick('a', { text: 'Logout' });
    });
});