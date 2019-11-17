const repository = require('../repositories/sueldoRepository')

async function getAll() {
    const result = repository.getAll()
    return result
}

async function add(nuevo) {
    const result = repository.add(nuevo)
    return result
}

async function deleteById(id) {
    const result = repository.deleteById(id)
    
    if (result == 0) {
        throw { status: 404, operacion: "deleteById", descripcion: "no existe un saldo con el id dado" }
    }
    return
}

async function updateById(id, nuevoSaldo) {
    const result = repository.updateById(id, nuevoSaldo)
    
    if (result == 0) {
        throw { status: 404, operacion: "updateById", descripcion: "no existe un saldo con el id dado" }
    }
    return nuevoSaldo
}

module.exports = {
    getAll,
    add,
    deleteById,
    updateById
}