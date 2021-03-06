/* eslint-disable no-console */
const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: './database/mydb.sqlite' },
    useNullAsDefault: true
})

knex.schema.createTable('gasto', (table) => {
    table.increments('id')
    table.integer('monto')
    table.string('descripcion')
    table.string('categoria')
    table.string('fecha')
})
    .then(() => console.log("listo"))
    .catch(error => console.log(error))

knex.schema.createTable('sueldo', (table) => {
    table.increments('id')
    table.integer('monto')
    table.string('descripcion')
    table.string('fecha')
})
    .then(() => console.log("listo"))
    .catch(error => console.log(error))

knex.schema.createTable('usuario', (table) => {
    table.increments('id')
    table.string('nombre')
    table.string('apellido')
    table.integer('dni')
    table.string('mail')
})
    .then(() => console.log("listo"))
    .catch(error => console.log(error))

knex.schema.createTable('foto', (table) => {
    table.increments('id')
    table.string('nombre')
    table.string('ruta')
})
    .then(() => console.log("listo"))
    .catch(error => console.log(error))