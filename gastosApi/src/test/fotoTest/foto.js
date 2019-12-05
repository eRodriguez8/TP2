/* eslint-disable no-console */
const client = require('./client')

async function testPostWithBody() {
    let result = false
    try {
        const name = 'foto.jpg'
        const path = __dirname + '/../fotos/foto.jpg'
        var options = {
            root: path,
            dotfiles: 'deny',
            headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
            }
        }

        sendFile(name, options, function (err) {
            if (err) {
                console.log('\n Error: ' + err)
            } else {
                console.log('Sent:', name)
            }
        })

        const fotoCreado = await client.crearGasto({
            monto: '123456',
            descripcion: 'withBody',
            categoria: 'test',
            fecha: '11/11/1213'
        })
        await client.borrarGasto(fotoCreado.id)
        validarGasto(fotoCreado)
        console.log("post with body: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testPostWithoutBody() {
    let result = false
    try {
        const fotoCreado = await client.crearGasto()
        console.log("post without body: error - no rechazó la petición!")
        await client.borrarGasto(fotoCreado.id)
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('post without body: ok (with expected error)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

// async function testGetAll() {
//     let result = false

//     const porCrear = [
//         {
//             monto: '123456',
//             descripcion: 'withBody',
//             categoria: 'test',
//             fecha: '11/11/1213'
//         }, {
//             monto: '1234567',
//             descripcion: 'withBody1',
//             categoria: 'test',
//             fecha: '11/11/1214'
//         }, {
//             monto: '1234568',
//             descripcion: 'withBody2',
//             categoria: 'test',
//             fecha: '11/11/1215'
//         }, {
//             monto: '1234569',
//             descripcion: 'withBody3',
//             categoria: 'test',
//             fecha: '11/11/1216'
//         }
//     ]

//     const porBorrar = []

//     try {
//         for (const foto of porCrear) {
//             const { id } = await client.crearGasto(foto)
//             porBorrar.push(id)
//         }

//         const fotos = await client.buscarTodos()
//         validarGastos(fotos)
//         console.log("get all: ok")
//         result = true
//     } catch (err) {
//         console.log(err.message)
//     } finally {
//         for (const id of porBorrar) {
//             try {
//                 await client.borrarGasto(id)
//             } catch (error) {
//                 // ok
//             }
//         }
//     }
//     return result
// }

async function testGetWithValidIdentifier() {
    let result = false

    const porCrear = {
        monto: '123456',
        descripcion: 'get',
        categoria: 'test',
        fecha: '11/11/1213'
    }

    let idCreado

    try {
        const { id } = await client.crearGasto(porCrear)
        idCreado = id
        console.log('GET BY ID: ' + idCreado)
        const foto = await client.buscarPorId(id)
        validarGasto(foto)
        if (id == foto.id) {
            console.log("get by existing id: ok")
            result = true
        } else {
            console.log("get by existing id: error - se encontró otro foto")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await client.borrarGasto(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testGetWithInvalidIdentifier() {
    let result = false
    try {
        await client.borrarGasto(0)
    } catch (err) {
        if (err.statusCode != 404) {
            throw err
        }
    }

    try {
        await client.buscarPorId(0)
        console.log("get by inexisting id: error - se encontró un foto inexistente")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("get by inexistent id: ok (with expected error)")
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function testDeleteWithValidIdentifier() {
    let result = false
    try {
        const { id } = await client.crearGasto({
            monto: '123456',
            descripcion: 'delete',
            categoria: 'test',
            fecha: '11/11/1213'
        })
        await client.borrarGasto(id)
        await client.buscarPorId(id)
        console.log("delete by existing id: error - no se borró el foto")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("delete by existing id: ok")
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function testDeleteWithInvalidIdentifier() {
    let result = false
    try {
        const { id } = await client.crearGasto({
            monto: '123456',
            descripcion: 'deleteInvalid',
            categoria: 'test',
            fecha: '11/11/1213'
        })
        await client.borrarGasto(id)
        await client.borrarGasto(id)
        console.log("delete by inexistent id: error - se borró algo que no debería existir")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("delete by inexistent id: ok")
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function main() {
    let exitos = 0
    const tests = [
        testPostWithBody,
        testPostWithoutBody,
        //testGetAll,
        testGetWithValidIdentifier,
        testGetWithInvalidIdentifier,
        testDeleteWithValidIdentifier,
        testDeleteWithInvalidIdentifier
    ]

    for (const test of tests) {
        exitos += (await test()) ? 1 : 0
    }

    console.log(`\nresultado de las pruebas: ${exitos}/${tests.length}`)
}
setTimeout(main, 2000)