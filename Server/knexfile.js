// Update with your config settings.
let path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

module.exports = {

  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host : "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_DEV || 'safestreets'
    },
    ssl: true,
    debug: false,
    migrations: {
      directory: './tools/knex/migrations'
    },
    seeds: {
      directory: './tools/knex/seeds'
    }
  },

  test: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host : "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_TEST || 'safestreets_test'
    },
    ssl: true,
    debug: false,
    migrations: {
      directory: './tools/knex/migrations'
    },
    seeds: {
      directory: './tools/knex/seeds'
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host : "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_DEV || 'safestreets'
    },
    ssl: true,
    debug: false,
    migrations: {
      directory: './tools/knex/migrations'
    },
    seeds: {
      directory: './tools/knex/seeds'
    }
  }

};
