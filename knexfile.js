require("dotenv").config();

module.exports = {
    development: {
        client: "pg",

        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // a Neon exige SSL
        },

        migrations: {
            directory: "./src/database/migrations",
        },

        seeds: {
            directory: "./src/database/seeds",
        },
    },
};