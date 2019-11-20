const knex = require('../db/knex')

async function getAll() {
    try {
        const result = await knex.select('*').from('usuario')
        return result
    } catch (err) {
        throw { status: 500, operacion: "getAll", descripcion: err.message }
    }
}

async function getById(id) {
    try {
        const result = await knex.select('*').from('usuario').where('id', id).limit(1)
        return result[0]
    } catch (err) {
        throw { status: 500, operacion: "getById", descripcion: err.message }
    }
}

async function add(nuevo) {
    try {
        knex('usuario').insert(nuevo)

        const [nuevoId] = await knex('usuario').insert(nuevo)
        nuevo.id = nuevoId
        return nuevo
    } catch (err) {
        throw { status: 500, operacion: "add", descripcion: err.message }
    }
}

async function deleteById(id) {
    try {
        const result = await knex('usuario').where('id', id).del()
        if (result == 0) {
            throw { status: 404, operacion: "deleteById", descripcion: "no existe un usuario con el id dado" }
        }
        return
    } catch (err) {
        if (err.status == 404) {
            throw err
        } else {
            throw { status: 500, operacion: "deleteById", descripcion: err.message }
        }
    }
}

async function updateById(id, nuevoUsuario) {
    try {
        const result = await knex('usuario').where('id', id).update(nuevoUsuario)
        if (result == 0) {
            throw { status: 404, operacion: "updateById", descripcion: "no existe un usuario con el id dado" }
        }
        return nuevoUsuario
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