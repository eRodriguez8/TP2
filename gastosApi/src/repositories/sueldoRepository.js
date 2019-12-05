const knex = require('../db/knex')

async function getAll() {
    try {
        const result = await knex.select('*').from('sueldo')
        return result
    } catch (err) {
        throw { status: 500, operacion: "getAll", descripcion: err.message }
    }
}

async function getById(id) {
    try {
        const result = await knex.select('*').from('sueldo').where('id', id).limit(1)
        return result[0]
    } catch (err) {
        throw { status: 500, operacion: "getById", descripcion: err.message }
    }
}

async function add(nuevo) {
    try {
        knex('sueldo').insert(nuevo)

        const [nuevoId] = await knex('sueldo').insert(nuevo)
        nuevo.id = nuevoId
        return nuevo
    } catch (err) {
        throw { status: 500, operacion: "add", descripcion: err.message }
    }
}

async function deleteById(id) {
    try {
        const result = await knex('sueldo').where('id', id).del()
        if (result === 0) {
            throw { status: 404, operacion: "deleteById", descripcion: "no existe un sueldo con el id dado" }
        }
        return result
    } catch (err) {
        if (err.status == 404) {
            throw err
        } else {
            throw { status: 500, operacion: "deleteById", descripcion: err.message }
        }
    }
}

async function updateById(id, nuevoSueldo) {
    try {
        const result = await knex('sueldo').where('id', id).update(nuevoSueldo)
        if (result === 0) {
            throw { status: 404, operacion: "updateById", descripcion: "no existe un sueldo con el id dado" }
        }
        return result
    } catch (err) {
        if (err.status == 404) {
            throw err
        } else {
            throw { status: 500, operacion: "updateById", descripcion: err.message }
        }
    }
}

module.exports = {
    getAll,
    getById,
    add,
    deleteById,
    updateById
}