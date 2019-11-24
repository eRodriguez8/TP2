const repoFotos = require('../repositories/fotoRepository')

async function getByName(name) {
    const ruta = '../repositories/fotos/' + name
    //metodo que busca en carpeta
    //devulvo el archivo
    const result = repoFotos.getById(id)
    return result
}

async function deleteByName(id) {
    const result = repoFotos.deleteById(id)
    
    if (result == 0) {
        throw { status: 404, operacion: "deleteByName", descripcion: "no existe una foto con ese nombre" }
    }
    return
}

async function add(nuevo) {
    const result = repoFotos.add(nuevo)
    return result
}
