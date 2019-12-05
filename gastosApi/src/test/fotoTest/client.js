const request = require('request-promise-native')

const serverUrl = 'http://localhost:5000/api/v1/'

async function crearFoto(foto) {
    const postOpt = {
       method: 'POST',
       uri: serverUrl + 'gastos',
       json: true
   }
   if (foto) {
       postOpt.body = foto
   }
   return await request(postOpt)
}

async function borrarFoto(id, name) {
    await request({
        method: 'DELETE',
        uri: serverUrl + 'gastos/' + id + '/fotos/' + name,
        json: true
    })
}

// async function buscarTodos() {
//     return await request({
//         method: 'GET',
//         uri: serverUrl + 'gastos',
//         json: true
//     })
// }

async function buscarPorId(id, name) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'gastos/' + id + '/fotos/' + name,
        json: true
    })
}

module.exports = {
    borrarFoto,
    crearFoto,
    //buscarTodos,
    buscarPorId
}