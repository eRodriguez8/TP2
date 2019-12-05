/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const client = require('./client')

// VALIDACIONES

function validarSueldo(sueldo) {
    const sueldoSchema = {
        id: Joi.number().integer().min(0),
        monto: Joi.number().integer().min(1).required(),
        descripcion: Joi.string().allow('').trim().strict().min(1).required(),
        fecha: Joi.string().allow('').trim().strict().min(1).required()
    }
    const { error } = Joi.validate(sueldo, sueldoSchema)
    if (error) {
        throw error
    }
}

function validarSueldos(sueldos) {
    for (const sueldo of sueldos) {
        validarSueldo(sueldo)
    }
}

// TESTS

async function testPostWithBody() {
    let result = false
    try {
        const sueldoCreado = await client.crearSueldo({
            monto: '123456',
            descripcion: 'withBody',
            fecha: '11/11/1213'
        })
        await client.borrarSueldo(sueldoCreado.id)
        validarSueldo(sueldoCreado)
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
        const sueldoCreado = await client.crearSueldo()
        console.log("post without body: error - no rechazó la petición!")
        await client.borrarSueldo(sueldoCreado.id)
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
            fecha: '11/11/1213'
        }, {
            monto: '1234567',
            descripcion: 'withBody1',
            fecha: '11/11/1214'
        }, {
            monto: '1234568',
            descripcion: 'withBody2',
            fecha: '11/11/1215'
        }, {
            monto: '1234569',
            descripcion: 'withBody3',
            fecha: '11/11/1216'
        }
    ]

    const porBorrar = []

    try {
        for (const sueldo of porCrear) {
            const { id } = await client.crearSueldo(sueldo)
            porBorrar.push(id)
        }

        const sueldos = await client.buscarTodos()
        validarSueldos(sueldos)
        console.log("get all: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    } finally {
        for (const id of porBorrar) {
            try {
                await client.borrarSueldo(id)
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
        fecha: '11/11/1213'
    }

    let idCreado

    try {
        const { id } = await client.crearSueldo(porCrear)
        idCreado = id
        console.log('GET BY ID: ' + idCreado)
        const sueldo = await client.buscarPorId(id)
        validarSueldo(sueldo)
        if (id == sueldo.id) {
            console.log("get by existing id: ok")
            result = true
        } else {
            console.log("get by existing id: error - se encontró otro sueldo")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await client.borrarSueldo(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testGetWithInvalidIdentifier() {
    let result = false
    try {
        await client.borrarSueldo(0)
    } catch (err) {
        if (err.statusCode != 404) {
            throw err
        }
    }

    try {
        await client.buscarPorId(0)
        console.log("get by inexisting id: error - se encontró un sueldo inexistente")
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
        const { id } = await client.crearSueldo({
            monto: '123456',
            descripcion: 'delete',
            fecha: '11/11/1213'
        })
        await client.borrarSueldo(id)
        await client.buscarPorId(id)
        console.log("delete by existing id: error - no se borró el sueldo")
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
        const { id } = await client.crearSueldo({
            monto: '123456',
            descripcion: 'deleteInvalid',
            fecha: '11/11/1213'
        })
        await client.borrarSueldo(id)
        await client.borrarSueldo(id)
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
        fecha: '11/11/1213'
    }

    let idCreado

    try {
        const { id } = await client.crearSueldo(porCrear)
        idCreado = id
        const nuevaDescripcion = 'put2'

        await client.reemplazarPorId(id, {
            id: id,
            monto: '123456',
            descripcion: nuevaDescripcion,
            fecha: '11/11/1213'
        })

        const buscado = await client.buscarPorId(id)
        validarSueldo(buscado)
        if (buscado.descripcion === nuevaDescripcion) {
            console.log("put by existing id: ok")
            result = true
        } else {
            console.log("put by existing id: error - se encontró el mismo sueldo sin reemplazar")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await client.borrarSueldo(idCreado)
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
        fecha: '11/11/1213'
    }

    let idCreado

    try {
        const { id } = await client.crearSueldo(porCrear)
        idCreado = id
        await client.borrarSueldo(id)

        await client.reemplazarPorId(id, {
            id: id,
            monto: '1234562',
            descripcion: 'putInvalid2',
            fecha: '11/11/1213'
        })
        console.log("put by inexistent id: error - se reemplazó un sueldo inexistente")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("put by inexistent id: ok")
            result = true
        } else {
            console.log(err.message)
        }
    } finally {
        try {
            await client.borrarSueldo(idCreado)
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