const knex = require('../db/knex')

async function add(nueva) {
    try {
        knex('foto').insert(nueva)

        const [nuevaId] = await knex('foto').insert(nueva)
        nueva.id = nuevaId
        return nueva
    } catch (err) {
        throw { status: 500, operacion: "add", descripcion: err.message }
    }
}

async function deleteByPath(path) {
    try {
        const result = await knex('foto').where('ruta', path).del()
        if (result === 0) {
            throw { status: 404, operacion: "deleteByName", descripcion: "no existe una foto con el nombre dado" }
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
    deleteByPath
}