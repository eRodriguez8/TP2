const knex = require('../db/knex')

async function add(nueva) {
    try {
        knex('gastoFoto').insert(nueva)

        const [nuevaId] = await knex('gastoFoto').insert(nueva)
        nueva.id = nuevaId
        return nueva
    } catch (err) {
        throw { status: 500, operacion: "add", descripcion: err.message }
    }
}

async function deleteById(id) {
    try {
        const result = await knex('gastoFoto').where('idGasto', id).del()
        if (result === 0) {
            throw { status: 404, operacion: "deleteById", descripcion: "no existe una relacion con el id dado" }
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

module.exports = {
    add,
    deleteById
}