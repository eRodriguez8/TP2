const request = require('request-promise-native')

const serverUrl = 'http://127.0.0.1:5000/api/v1/'

async function crearUsuario(usuario) {
    const postOpt = {
        method: 'POST',
        uri: serverUrl + 'usuarios',
        json: true
    }
    if (usuario) {
        postOpt.body = usuario
    }
    return await request(postOpt)
}


async function borrarUsuario(id) {
    await request({
        method: 'DELETE',
        uri: serverUrl + 'usuarios/' + id,
        json: true
    })
}
//
async function buscarTodos() {
    return await request({
        method: 'GET',
        uri: serverUrl + 'usuarios',
        json: true
    })
}

async function buscarPorParametros(params) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'usuarios',
        qs: params,
        json: true
    })
}

async function buscarPorId(id) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'usuarios/' + id,
        json: true
    })
}

async function reemplazarPorId(id, estudiante) {
    return await request({
        method: 'PUT',
        uri: serverUrl + 'usuarios/' + id,
        body: usuario,
        json: true
    })
}

module.exports = {
    buscarTodos,
    buscarPorParametros,
    buscarPorId,
    crearUsuario,
    borrarUsuario,
    reemplazarPorId
}