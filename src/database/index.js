const knexfile = require("../../knexfile");

console.log("=== CONFIG DO KNEX ===");
console.log(knexfile.development);

const knex = require("knex")(knexfile.development);

module.exports = knex;