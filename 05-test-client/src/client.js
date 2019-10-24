const request = require('request-promise-native')

const serverUrl = 'http://127.0.0.1:8080/api/'

async function crearEstudiante(estudiante) {
    const postOpt = {
        method: 'POST',
        uri: serverUrl + 'estudiantes',
        json: true
    }
    if (estudiante) {
        postOpt.body = estudiante
    }
    return await request(postOpt)
}

async function borrarEstudiante(id) {
    await request({
        method: 'DELETE',
        uri: serverUrl + 'estudiantes/' + id,
        json: true
    })
}

async function buscarTodos() {
    return await request({
        method: 'GET',
        uri: serverUrl + 'estudiantes',
        json: true
    })
}

async function buscarPorParametros(params) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'estudiantes',
        qs: params,
        json: true
    })
}

async function buscarPorId(id) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'estudiantes/' + id,
        json: true
    })
}

async function reemplazarPorId(id, estudiante) {
    return await request({
        method: 'PUT',
        uri: serverUrl + 'estudiantes/' + id,
        body: estudiante,
        json: true
    })
}

module.exports = {
    buscarTodos,
    buscarPorParametros,
    buscarPorId,
    crearEstudiante,
    borrarEstudiante,
    reemplazarPorId
}