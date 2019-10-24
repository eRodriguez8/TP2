/* eslint-disable no-console */
const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: './database/mydb.sqlite' },
    useNullAsDefault: true
})

knex.schema.createTable('estudiantes', (table) => {
    table.increments('id')
    table.string('nombre')
    table.string('apellido')
    table.integer('edad')
    table.integer('dni')
})
    .then(() => console.log("listo"))
    .catch(error => console.log(error))