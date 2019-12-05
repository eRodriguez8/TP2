const repoSueldos = require('../repositories/sueldoRepository')

async function getAll() {
    const result = repoSueldos.getAll()
    return result
}

async function getById(id) {
    const result = repoSueldos.getById(id)
    return result
}

async function add(nuevo) {
    const result = repoSueldos.add(nuevo)
    return result
}

async function deleteById(id) {
    const result = repoSueldos.deleteById(id)
    if (result === 0) {
        throw { status: 404, operacion: "deleteById", descripcion: "no existe un saldo con el id dado" }
    }
    return result
}

async function updateById(id, nuevoSueldo) {
    const result = repoSueldos.updateById(id, nuevoSueldo)
    if (result === 0) {
        throw { status: 404, operacion: "updateById", descripcion: "no existe un saldo con el id dado" }
    }
    return result
}

module.exports = {
    getAll,
    getById,
    add,
    deleteById,
    updateById
}