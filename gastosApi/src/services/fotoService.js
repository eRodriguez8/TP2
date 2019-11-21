const repository = require('../repositories/fotoRepository')

async function findByName(name) {
    const result = repository.findByName(name)
    
    if (result == 0) {
        throw { status: 404, operacion: "findByName", descripcion: "no existe la foto con el nombre dado" }
    }
    return
}

async function add(nuevo) {
    const result = repository.add(nuevo)
    return result}


    module.exports = {
        findByName,
        add
        
    }