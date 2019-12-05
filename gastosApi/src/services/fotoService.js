const repoFotos = require('../repositories/fotoRepository')
const repoGastoFoto = require('../repositories/gastoFotoRepository')

async function deleteByPath(idGasto, path) {
    const result = repoFotos.deleteByPath(path)
    repoGastoFoto.deleteById(idGasto)
    if (result === 0) {
        throw { status: 404, operacion: "deleteByPath", descripcion: "no existe una foto con ese nombre" }
    }
    return result
}

async function add(idGasto, nueva) {
    const result = repoFotos.add(nueva)

    const relacion = {
        idGasto: idGasto,
        idFoto: nueva.id
    }

    repoGastoFoto.add(relacion)
    return result
}

module.exports = {
    deleteByPath,
    add
}