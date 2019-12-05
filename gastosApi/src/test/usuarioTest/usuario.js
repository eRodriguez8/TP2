/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const client = require('./client')

// VALIDACIONES

function validarUsuario(usuario) {
    const usuarioSchema = {
        id: Joi.number().integer().min(0),
        nombre: Joi.string().alphanum().min(1).required(),
        apellido: Joi.string().alphanum().min(1).required(),
        dni: Joi.number().min(1).max(99999999).required(),
        mail:Joi.string().email().max(256).required()
        
    }
    const { error } = Joi.validate(usuario, usuarioSchema)
    if (error) {
        throw error
    }
}

function validarUsuarios(usuarios) {
    for (const usuario of usuarios) {
        validarUsuario(usuario)
    }
}

// TESTS

async function testPostWithBody() {
    let result = false
    try {
        const usuCreado = await client.crearUsuario({
            nombre: 'Body',
            apellido: 'withBody',
            dni: '11122233',
            mail: 'ss@mail.com'
        })
        await client.borrarUsuario(usuCreado.id)
        validarUsuario(usuCreado)
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
        const usuCreado = await client.crearUsuario()
        console.log("post without body: error - no rechazó la petición!")
        await client.borrarUsuario(usuCreado.id)
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
            nombre: 'get1',
            apellido: 'all',
            dni: '2221',
            mail: 's1@mail.com'
        }, {
            nombre: 'get2',
            apellido: 'all',
            dni: '2222',
            mail: 's2@mail.com'
        }, {
            nombre: 'get3',
            apellido: 'all',
            dni: '2223',
            mail: 's3@mail.com'
        }, {
            nombre: 'get4',
            apellido: 'all',
            dni: '2224',
            mail: 's4@mail.com'
        }
    ]

    const porBorrar = []

    try {
        for (const user of porCrear) {
            const { id } = await client.crearUsuario(user)
            porBorrar.push(id)
        }

        const usuarios = await client.buscarTodos()
        validarUsuarios(usuarios)
        console.log("get all: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    } finally {
        for (const id of porBorrar) {
            try {
                await client.borrarUsuario(id)
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
        nombre: 'get',
        apellido: 'validId',
        dni: '333',
        mail: 'ss@mail.com'
    }

    let idCreado

    try {
        const { id } = await client.crearUsuario(porCrear)
        idCreado = id

        const usuario = await client.buscarPorId(id)
        validarUsuario(usuario)
        if (id == usuario.id) {
            console.log("get by existing id: ok")
            result = true
        } else {
            console.log("get by existing id: error - se encontró otro usuario")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await client.borrarUsuario(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testGetWithInvalidIdentifier() {
    let result = false
    try {
        await client.borrarUsuario(0)
    } catch (err) {
        if (err.statusCode != 404) {
            throw err
        }
    }

    try {
        await client.buscarPorId(0)
        console.log("get by inexisting id: error - se encontró un usuario inexistente")
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
        const { id } = await client.crearUsuario({
            nombre: 'delete',
            apellido: 'validId',
            dni: '555',
            mail: 'ss@mail.com'
        })
        await client.borrarUsuario(id)
        await client.buscarPorId(id)
        console.log("delete by existing id: error - no se borró el usuario")
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
        const { id } = await client.crearUsuario({
            nombre: 'delete',
            apellido: 'invalidId',
            dni: '666',
            mail: 's6@mail.com'
        })
        await client.borrarUsuario(id)
        await client.borrarUsuario(id)
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
        nombre: 'put',
        apellido: 'validId',
        dni: '777',
        mail: 'ss@mail.com'
    }

    let idCreado

    try {
        const { id } = await client.crearUsuario(porCrear)
        idCreado = id

        const nuevaNombre = 'put2'

        await client.reemplazarPorId(id, {
            id: id,
            nombre: nuevaNombre,
            apellido: 'validId',
            dni: '777',
            mail: 'ss@mail.com'
        })

        const buscado = await client.buscarPorId(id)
        validarUsuario(buscado)
        if (buscado.nombre === nuevaNombre) {
            console.log("put by existing id: ok")
            result = true
        } else {
            console.log("put by existing id: error - se encontró el mismo usuario sin reemplazar")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await client.borrarUsuario(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testPutWithInvalidIdentifier() {
    let result = false

    const porCrear = {
        nombre: 'put',
        apellido: 'validId',
        dni: '777',
        mail: 'ss@mail.com'
    }

    let idCreado

    try {
        const { id } = await client.crearUsuario(porCrear)
        idCreado = id
        await client.borrarUsuario(id)

        await client.reemplazarPorId(id, {
            id: id,
            nombre: 'put2',
            apellido: 'validId2',
            dni: '777',
            mail: 'ss@mail.com'
        })
        console.log("put by inexistent id: error - se reemplazó un usuario inexistente")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("put by inexistent id: ok")
            result = true
        } else {
            console.log(err.message)
        }
    } finally {
        try {
            await client.borrarUsuario(idCreado)
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