const request = require('request-promise-native')

const serverUrl = 'http://localhost:5000/api/v1/'

async function crearSueldo(sueldo) {
    const postOpt = {
       method: 'POST',
       uri: serverUrl + 'sueldos',
       json: true
   }
   if (sueldo) {
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

async function buscarTodos() {
    return await request({
        method: 'GET',
        uri: serverUrl + 'sueldos',
        json: true
    })
}

async function buscarPorId(id) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'sueldos/' + id,
        json: true
    })
}

async function reemplazarPorId(id, sueldo) {
    return await request({
        method: 'PUT',
        uri: serverUrl + 'sueldos/' + id,
        body: sueldo,
        json: true
    })
}

module.exports = {
    borrarSueldo,
    crearSueldo,
    buscarTodos,
    buscarPorId,
    reemplazarPorId
}