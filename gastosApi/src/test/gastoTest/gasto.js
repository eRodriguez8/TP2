/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const client = require('./client')

// VALIDACIONES

function validarGasto(gasto) {
    const gastoSchema = {
        id: Joi.number().integer().min(0),
        monto: Joi.number().integer().min(1).required(),
        descripcion: Joi.string().allow('').trim().strict().min(1).required(),
        categoria: Joi.string().allow('').trim().strict().min(1).required(),
        fecha: Joi.string().allow('').trim().strict().min(1).required()
    }
    const { error } = Joi.validate(gasto, gastoSchema)
    if (error) {
        throw error
    }
}

function validarGastos(gastos) {
    for (const gasto of gastos) {
        validarGasto(gasto)
    }
}

// TESTS

async function testPostWithBody() {
    let result = false
    try {
        const gastoCreado = await client.crearGasto({
            monto: '123456',
            descripcion: 'withBody',
            categoria: 'test',
            fecha: '11/11/1213'
        })
        await client.borrarGasto(gastoCreado.id)
        validarGasto(gastoCreado)
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
        const gastoCreado = await client.crearGasto()
        console.log("post without body: error - no rechazó la petición!")
        await client.borrarGasto(gastoCreado.id)
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

async function testGetAll() {
    let result = false

    const porCrear = [
        {
            monto: '123456',
            descripcion: 'withBody',
            categoria: 'test',
            fecha: '11/11/1213'
        }, {
            monto: '1234567',
            descripcion: 'withBody1',
            categoria: 'test',
            fecha: '11/11/1214'
        }, {
            monto: '1234568',
            descripcion: 'withBody2',
            categoria: 'test',
            fecha: '11/11/1215'
        }, {
            monto: '1234569',
            descripcion: 'withBody3',
            categoria: 'test',
            fecha: '11/11/1216'
        }
    ]

    const porBorrar = []

    try {
        for (const gasto of porCrear) {
            const { id } = await client.crearGasto(gasto)
            porBorrar.push(id)
        }

        const gastos = await client.buscarTodos()
        validarGastos(gastos)
        console.log("get all: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    } finally {
        for (const id of porBorrar) {
            try {
                await client.borrarGasto(id)
            } catch (error) {
                // ok
            }
        }
    }
    return result
}

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
        const gasto = await client.buscarPorId(id)
        validarGasto(gasto)
        if (id == gasto.id) {
            console.log("get by existing id: ok")
            result = true
        } else {
            console.log("get by existing id: error - se encontró otro gasto")
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
        console.log("get by inexisting id: error - se encontró un gasto inexistente")
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
        console.log("delete by existing id: error - no se borró el gasto")
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

async function testPutWithValidIdentifier() {
    let result = false

    const porCrear = {
        monto: '123456',
        descripcion: 'put',
        categoria: 'test',
        fecha: '11/11/1213'
    }

    let idCreado

    try {
        const { id } = await client.crearGasto(porCrear)
        idCreado = id
        const nuevaDescripcion = 'put2'

        await client.reemplazarPorId(id, {
            id: id,
            monto: '123456',
            descripcion: nuevaDescripcion,
            categoria: 'test',
            fecha: '11/11/1213'
        })

        const buscado = await client.buscarPorId(id)
        validarGasto(buscado)
        if (buscado.descripcion === nuevaDescripcion) {
            console.log("put by existing id: ok")
            result = true
        } else {
            console.log("put by existing id: error - se encontró el mismo gasto sin reemplazar")
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

async function testPutWithInvalidIdentifier() {
    let result = false

    const porCrear = {
        monto: '123456',
        descripcion: 'putInvalid',
        categoria: 'test',
        fecha: '11/11/1213'
    }

    let idCreado

    try {
        const { id } = await client.crearGasto(porCrear)
        idCreado = id
        await client.borrarGasto(id)

        await client.reemplazarPorId(id, {
            id: id,
            monto: '1234562',
            descripcion: 'putInvalid2',
            categoria: 'test',
            fecha: '11/11/1213'
        })
        console.log("put by inexistent id: error - se reemplazó un gasto inexistente")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("put by inexistent id: ok")
            result = true
        } else {
            console.log(err.message)
        }
    } finally {
        try {
            await client.borrarGasto(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function main() {
    let exitos = 0
    const tests = [
        testPostWithBody,
        testPostWithoutBody,
        testGetAll,
        testGetWithValidIdentifier,
        testGetWithInvalidIdentifier,
        testDeleteWithValidIdentifier,
        testDeleteWithInvalidIdentifier,
        testPutWithValidIdentifier,
        testPutWithInvalidIdentifier
    ]

    for (const test of tests) {
        exitos += (await test()) ? 1 : 0
    }

    console.log(`\nresultado de las pruebas: ${exitos}/${tests.length}`)
}
setTimeout(main, 2000)