const repoUsuarios = require('../repositories/usuarioRepository')

async function getAll() {
    const result = repoUsuarios.getAll()
    return result
}

async function getById(id) {
    const result = repoUsuarios.getById(id)
    return result
}

async function add(nuevo) {
    const result = repoUsuarios.add(nuevo)
    return result
}

async function deleteById(id) {
    const result = repoUsuarios.deleteById(id)
    
    if (result === 0) {
        throw { status: 404, operacion: "deleteById", descripcion: "no existe un usuario con el id dado" }
    }
    return result
}

async function updateById(id, nuevoUsuario) {
    const result = repoUsuarios.updateById(id, nuevoUsuario)
    if (result === 0) {
        throw { status: 404, operacion: "updateById", descripcion: "no existe un estudiante con el id dado" }
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