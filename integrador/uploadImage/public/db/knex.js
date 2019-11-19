const { dbConfig } = require('../config.js')

const knex = require('knex')(dbConfig)

module.exports = knex