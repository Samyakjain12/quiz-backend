require("dotenv").config({ path: ".env" });
const { DB_NAME, DB_USER, DB_HOST, DB_PASS, DB_DRIVER, DB_PORT} = process.env;

module.exports = {
  development: {
    client: DB_DRIVER,
    connection: {
    host: DB_HOST, 
    port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      charset: "utf8mb4",
      timezone: '+05:30'
    },
    pool: {
      max: 200,
      min: 0,
    }
  },



  production: {
    client: DB_DRIVER,
    connection: {
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      charset: "utf8mb4",
      host: DB_HOST, 
      port: DB_PORT
    },
    pool: {
      max: 100,
      min: 0,
    }
  },
};