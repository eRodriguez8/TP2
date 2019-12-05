const request = require('request-promise-native')

const serverUrl = 'http://localhost:5000/api/v1/'

async function crearGasto(gasto) {
    const postOpt = {
       method: 'POST',
       uri: serverUrl + 'gastos',
       json: true
   }
   if (gasto) {
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

async function buscarTodos() {
    return await request({
        method: 'GET',
        uri: serverUrl + 'gastos',
        json: true
    })
}

async function buscarPorId(id) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'gastos/' + id,
        json: true
    })
}

async function reemplazarPorId(id, gasto) {
    return await request({
        method: 'PUT',
        uri: serverUrl + 'gastos/' + id,
        body: gasto,
        json: true
    })
}

module.exports = {
    borrarGasto,
    crearGasto,
    buscarTodos,
    buscarPorId,
    reemplazarPorId
}