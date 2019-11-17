const repository = require('../repositories/usuarioRepository')

async function getAll() {
    const result = repository.getAll()
    return result
}

async function getById(id) {
    const result = repository.getById(id)
    return result
}

async function add(nuevo) {
    const result = repository.add(nuevo)
    return result
}

async function deleteById(id) {
    const result = repository.deleteById(id)
    
    if (result == 0) {
        throw { status: 404, operacion: "deleteById", descripcion: "no existe un usuario con el id dado" }
    }
    return
}

async function updateById(id, nuevoUsuario) {
    const result = repository.updateById(id, nuevoUsuario)
    
    if (result == 0) {
        throw { status: 404, operacion: "updateById", descripcion: "no existe un estudiante con el id dado" }
    }
    return nuevoUsuario
}

module.exports = {
    getAll,
    getById,
    add,
    deleteById,
    updateById
}