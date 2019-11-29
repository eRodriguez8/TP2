const request = require('request-promise-native')

const serverUrl = 'http://localhost:5000/api/v1/'

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

async function buscarPorId(id) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'usuarios/' + id,
        json: true
    })
}

async function reemplazarPorId(id, usuario) {
    return await request({
        method: 'PUT',
        uri: serverUrl + 'usuarios/' + id,
        body: usuario,
        json: true
    })
}

async function buscarTodos() {
    return await request({
        method: 'GET',
        uri: serverUrl + 'usuarios',
        json: true
    })
}

async function crearSueldo(sueldo) {
    const postOpt = {
       method: 'POST',
       uri: serverUrl + 'sueldos',
       json: true
   }
   if (usuario) {
       postOpt.body = sueldo
   }
   return await request(postOpt)
}

async function borrarSueldo(id) {
    await request({
        method: 'DELETE',
        uri: serverUrl + 'sueldos/' + id,
        json: true
    })
}

async function crearGasto(gasto) {
    const postOpt = {
       method: 'POST',
       uri: serverUrl + 'gastos',
       json: true
   }
   if (usuario) {
       postOpt.body = gasto
   }
   return await request(postOpt)
}

async function borrarGasto(id) {
    await request({
        method: 'DELETE',
        uri: serverUrl + 'gastos/' + id,
        json: true
    })
}

module.exports = {
    buscarTodos,
    buscarPorId,
    crearUsuario,
    borrarUsuario,
    reemplazarPorId,
    borrarSueldo,
    crearSueldo,
    borrarGasto,
    crearGasto
}