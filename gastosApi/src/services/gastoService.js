const repoGastos = require('../repositories/gastoRepository')

async function getAll() {
        const result = repoGastos.getAll()
        return result
}

async function getById(id) {
    const result = repoGastos.getById(id)
    return result
}

async function add(nuevo) {
        const result = repoGastos.add(nuevo)
        return result
}

async function deleteById(id) {
    const result = repoGastos.deleteById(id)
    
    if (result === 0) {
        throw { status: 404, operacion: "deleteById", descripcion: "no existe un gasto con el id dado" }
    }
    return result
}

async function updateById(id, nuevoGasto) {
    const result = repoGastos.updateById(id, nuevoGasto)
    
    if (result === 0) {
        throw { status: 404, operacion: "updateById", descripcion: "no existe un gasto con el id dado" }
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