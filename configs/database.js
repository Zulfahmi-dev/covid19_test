'use strict'
// const fs = require("fs")
const Pool = require("pg").Pool

// let rawdata = fs.readFileSync("./cloud.json")
// let setting = JSON.parse(rawdata)

const pool = new Pool({
  host: 'localhost',
  database: 'covid19_test',
  user: 'postgres',
  password: 'root',
  port: 5432,
})

module.exports = pool