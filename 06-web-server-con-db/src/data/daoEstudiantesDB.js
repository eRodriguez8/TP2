const knex = require('../db/knex')

async function getAll() {
    try {
        // const selectAllQuery = `SELECT * FROM estudiantes;`
        // const result = await knex.raw(selectAllQuery)
        const result = await knex.select('*').from('estudiantes')
        return result
    } catch (err) {
        throw { status: 500, operacion: "getAll", descripcion: err.message }
    }
}

async function getByAge(edadMin, edadMax) {
    try {
        // const selectByEdadQuery = `SELECT * FROM estudiantes WHERE edad >= ${edadMin} AND edad <= ${edadMax};`
        // const result = await knex.raw(selectByEdadQuery)
        const result = await knex.select('*').from('estudiantes').whereBetween('edad', [edadMin, edadMax])
        return result
    } catch (err) {
        throw { status: 500, operacion: "getByAge", descripcion: err.message }
    }
}

async function getByDni(dni) {
    try {
        const result = await knex.select('*').from('estudiantes').where('dni', dni).limit(1)
        return result[0]
    } catch (err) {
        throw { status: 500, operacion: "getByDni", descripcion: err.message }
    }
}

async function getById(id) {
    try {
        const result = await knex.select('*').from('estudiantes').where('id', id).limit(1)
        return result[0]
    } catch (err) {
        throw { status: 500, operacion: "getById", descripcion: err.message }
    }
}

async function add(nuevo) {
    try {
        knex('estudiantes').insert(nuevo)

        const [nuevoId] = await knex('estudiantes').insert(nuevo)//.returning('id') no es necesario en sqlite
        nuevo.id = nuevoId
        return nuevo
    } catch (err) {
        throw { status: 500, operacion: "add", descripcion: err.message }
    }
}

async function deleteByDni(dni) {
    try {
        // const deleteByDniQuery = `DELETE FROM estudiantes WHERE dni=${dni}`
        // await knex.raw(deleteByDniQuery)
        await knex('estudiantes').where('dni', dni).del()
        return
    } catch (err) {
        throw { status: 500, operacion: "deleteByDni", descripcion: err.message }
    }
}

async function deleteById(id) {
    try {
        // const deleteByIdQuery = `DELETE FROM estudiantes WHERE id=${id}`
        // await knex.raw(deleteByIdQuery)
        const result = await knex('estudiantes').where('id', id).del()
        if (result == 0) {
            throw { status: 404, operacion: "deleteById", descripcion: "no existe un estudiante con el id dado" }
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

async function updateByDni(dni, nuevoEstu) {
    try {
        let updateByDniQuery = 'UPDATE estudiantes '
        updateByDniQuery += `SET nombre='${nuevoEstu.nombre}', `
        updateByDniQuery += `apellido='${nuevoEstu.apellido}', edad=${nuevoEstu.edad}, dni='${nuevoEstu.dni}' `
        updateByDniQuery += `WHERE dni=${dni};`
        await knex.raw(updateByDniQuery)
        return nuevoEstu
    } catch (err) {
        throw { status: 500, operacion: "updateByDni", descripcion: err.message }
    }
}

async function updateById(id, nuevoEstu) {
    try {
        // let updateByDniQuery = 'UPDATE estudiantes '
        // updateByDniQuery += `SET nombre='${nuevoEstu.nombre}', `
        // updateByDniQuery += `apellido='${nuevoEstu.apellido}', edad=${nuevoEstu.edad}, id='${nuevoEstu.id}' `
        // updateByDniQuery += `WHERE id=${id};`
        // await knex.raw(updateByDniQuery)
        const result = await knex('estudiantes').where('id', id).update(nuevoEstu)
        if (result == 0) {
            throw { status: 404, operacion: "updateById", descripcion: "no existe un estudiante con el id dado" }
        }
        return nuevoEstu
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
    getByAge,
    getByDni,
    getById,
    add,
    deleteByDni,
    deleteById,
    updateByDni,
    updateById
}