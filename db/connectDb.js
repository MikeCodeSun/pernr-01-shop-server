const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.BD_PASSWORD,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
});

module.exports = pool;
