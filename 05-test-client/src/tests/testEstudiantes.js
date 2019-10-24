/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const cli = require('../client')

// VALIDACIONES

function validarEstudiante(estudiante) {
    const estudianteSchema = {
        id: Joi.number().integer().min(0),
        nombre: Joi.string().alphanum().min(1).required(),
        apellido: Joi.string().alphanum().min(1).required(),
        edad: Joi.number().integer().min(0).max(120).required(),
        dni: Joi.number().min(1).max(99999999).required(),
    }
    const { error } = Joi.validate(estudiante, estudianteSchema)
    if (error) {
        throw error
    }
}

function validarEstudiantes(estudiantes) {
    for (const estudiante of estudiantes) {
        validarEstudiante(estudiante)
    }
}

function validarEdades(estudiantes, desde, hasta) {
    for (const estudiante of estudiantes) {
        if (estudiante.edad < desde || estudiante.edad > hasta) {
            throw { message: "edad fuera de rango" }
        }
    }
}

// TESTS

async function testPostWithBody() {
    let result = false
    try {
        const estuCreado = await cli.crearEstudiante({
            nombre: 'post',
            apellido: 'withBody',
            edad: 33,
            dni: '11122233'
        })
        await cli.borrarEstudiante(estuCreado.id)
        validarEstudiante(estuCreado)
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
        const estuCreado = await cli.crearEstudiante()
        console.log("post without body: error - no rechazó la petición!")
        await cli.borrarEstudiante(estuCreado.id)
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
            edad: 10,
            dni: '2221'
        }, {
            nombre: 'get2',
            apellido: 'all',
            edad: 20,
            dni: '2222'
        }, {
            nombre: 'get3',
            apellido: 'all',
            edad: 30,
            dni: '2223'
        }, {
            nombre: 'get4',
            apellido: 'all',
            edad: 40,
            dni: '2224'
        }
    ]

    const porBorrar = []

    try {
        for (const est of porCrear) {
            const { id } = await cli.crearEstudiante(est)
            porBorrar.push(id)
        }

        const estudiantes = await cli.buscarTodos()
        validarEstudiantes(estudiantes)
        console.log("get all: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    } finally {
        for (const id of porBorrar) {
            try {
                await cli.borrarEstudiante(id)
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
        edad: 33,
        dni: '333'
    }

    let idCreado

    try {
        const { id } = await cli.crearEstudiante(porCrear)
        idCreado = id

        const estudiante = await cli.buscarPorId(id)
        validarEstudiante(estudiante)
        if (id == estudiante.id) {
            console.log("get by existing id: ok")
            result = true
        } else {
            console.log("get by existing id: error - se encontró otro estudiante")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await cli.borrarEstudiante(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testGetWithInvalidIdentifier() {
    let result = false
    try {
        await cli.borrarEstudiante(0)
    } catch (err) {
        if (err.statusCode != 404) {
            throw err
        }
    }

    try {
        await cli.buscarPorId(0)
        console.log("get by inexisting id: error - se encontró un estudiante inexistente")
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

async function testGetByRangoEdad() {
    let result = false

    const porCrear = [
        {
            nombre: 'get1',
            apellido: 'rangoEdad',
            edad: 10,
            dni: '2221'
        }, {
            nombre: 'get2',
            apellido: 'rangoEdad',
            edad: 20,
            dni: '2222'
        }, {
            nombre: 'get3',
            apellido: 'rangoEdad',
            edad: 30,
            dni: '2223'
        }, {
            nombre: 'get4',
            apellido: 'rangoEdad',
            edad: 40,
            dni: '2224'
        }
    ]

    const porBorrar = []

    try {
        for (const est of porCrear) {
            const { id } = await cli.crearEstudiante(est)
            porBorrar.push(id)
        }

        const desde = 15
        const hasta = 35
        const estudiantes = await cli.buscarPorParametros({ edadMin: desde, edadMax: hasta })
        validarEstudiantes(estudiantes)
        validarEdades(estudiantes, desde, hasta)
        console.log("get by rango edad: ok")
        result = true
    } catch (err) {
        console.log("get by rango edad: error - " + err.message)
    } finally {
        for (const id of porBorrar) {
            try {
                await cli.borrarEstudiante(id)
            } catch (error) {
                // ok
            }
        }
    }
    return result
}

async function testGetByDni() {
    let result = false

    const porCrear = {
        nombre: 'get',
        apellido: 'validId',
        edad: 33,
        dni: '333'
    }

    let idCreado

    try {
        const { id, dni } = await cli.crearEstudiante(porCrear)
        idCreado = id
        const estudiante = await cli.buscarPorParametros({ dni: dni })
        if (!estudiante) {
            console.log("get by existing dni: error - no se encontró un estudiante existente")
        } else {
            validarEstudiante(estudiante)

            if (estudiante.hasOwnProperty("id") && estudiante.id == id) {
                console.log("get by existing dni: ok")
                result = true
            } else {
                console.log("get by existing dni: error - se encontró otro estudiante")
            }
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await cli.borrarEstudiante(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testDeleteWithValidIdentifier() {
    let result = false
    try {
        const { id } = await cli.crearEstudiante({
            nombre: 'delete',
            apellido: 'validId',
            edad: 33,
            dni: '555'
        })
        await cli.borrarEstudiante(id)
        await cli.buscarPorId(id)
        console.log("delete by existing id: error - no se borró el estudiante")
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
        const { id } = await cli.crearEstudiante({
            nombre: 'delete',
            apellido: 'invalidId',
            edad: 33,
            dni: '666'
        })
        await cli.borrarEstudiante(id)
        await cli.borrarEstudiante(id)
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
        edad: 33,
        dni: '777'
    }

    let idCreado

    try {
        const { id } = await cli.crearEstudiante(porCrear)
        idCreado = id

        const nuevaEdad = 34

        await cli.reemplazarPorId(id, {
            id: id,
            nombre: 'put2',
            apellido: 'validId2',
            edad: nuevaEdad,
            dni: '777'
        })

        const buscado = await cli.buscarPorId(id)
        validarEstudiante(buscado)
        if (buscado.edad == nuevaEdad) {
            console.log("put by existing id: ok")
            result = true
        } else {
            console.log("put by existing id: error - se encontró el mismo estudiante sin reemplazar")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await cli.borrarEstudiante(idCreado)
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
        edad: 33,
        dni: '777'
    }

    let idCreado

    try {
        const { id } = await cli.crearEstudiante(porCrear)
        idCreado = id
        await cli.borrarEstudiante(id)

        await cli.reemplazarPorId(id, {
            id: id,
            nombre: 'put2',
            apellido: 'validId2',
            edad: 34,
            dni: '777'
        })
        console.log("put by inexistent id: error - se reemplazó un estudiante inexistente")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("put by inexistent id: ok")
            result = true
        } else {
            console.log(err.message)
        }
    } finally {
        try {
            await cli.borrarEstudiante(idCreado)
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
        testGetByRangoEdad,
        testGetByDni,
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