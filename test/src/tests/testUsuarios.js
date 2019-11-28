/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const usu = require('../client')

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

//function validarSueldo(sueldo) {
   // const sueldoSchema = {
      //  id: Joi.number().integer().min(0),
      //  monto: Joi.number().min(1).max(99999999).required(),
      //// fecha:Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']),
      //  apellido: Joi.string().alphanum().min(1).required()
        
   // }
   // const { error } = Joi.validate(sueldo, sueldoSchema)
  //  if (error) {
     //   throw error
   // }
//}


// TESTS

async function testPostWithBody() {
    let result = false
    try {
        const usuCreado = await usu.crearUsuario({
            nombre: 'post',
            apellido: 'withBody',
            dni: '11122233',
            mail: 'ss@mail.com'
        })
        await usu.borrarUsuario(usuCreado.id)
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
        const usuCreado = await usu.crearUsuario()
        console.log("post without body: error - no rechazó la petición!")
        await usu.borrarUsuario(usuCreado.id)
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
        for (const usua of porCrear) {
            const { id } = await usu.crearUsuario(usua)
            porBorrar.push(id)
        }

        const usuarios = await usu.buscarTodos()
        validarUsuarios(usuarios)
        console.log("get all: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    } finally {
        for (const id of porBorrar) {
            try {
                await usu.borrarUsuario(id)
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
        const { id } = await usu.crearUsuario(porCrear)
        idCreado = id

        const usuario = await usu.buscarPorId(id)
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
            await usu.borrarUsuario(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testGetWithInvalidIdentifier() {
    let result = false
    try {
        await usu.borrarUsuario(0)
    } catch (err) {
        if (err.statusCode != 404) {
            throw err
        }
    }

    try {
        await usu.buscarPorId(0)
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



async function testGetByDni() {
    let result = false

    const porCrear = {
        nombre: 'get',
        apellido: 'validId',
        dni: '333',
        mail: 'ss@mail.com'
    }

    let idCreado

    try {
        const { id, dni } = await usu.crearUsuario(porCrear)
        idCreado = id
        const usuario = await usu.buscarPorParametros({ dni: dni })
        if (!usuario) {
            console.log("get by existing dni: error - no se encontró un usuario existente")
        } else {
            validarUsuario(usuario)

            if (usuario.hasOwnProperty("id") && usuario.id == id) {
                console.log("get by existing dni: ok")
                result = true
            } else {
                console.log("get by existing dni: error - se encontró otro usuario")
            }
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await usu.borrarUsuario(idCreado)
        } catch (error) {
            // ok
        }
    }
    return result
}

async function testDeleteWithValidIdentifier() {
    let result = false
    try {
        const { id } = await usu.crearUsuario({
            nombre: 'delete',
            apellido: 'validId',
            dni: '555',
            mail: 'ss@mail.com'
        })
        await usu.borrarUsuario(id)
        await usu.buscarPorId(id)
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
        const { id } = await usu.crearUsuario({
            nombre: 'delete',
            apellido: 'invalidId',
            dni: '666',
            mail: 's6@mail.com'
        })
        await usu.borrarUsuario(id)
        await usu.borrarUsuario(id)
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
        const { id } = await usu.crearUsuario(porCrear)
        idCreado = id

        const nuevaEdad = 34

        await usu.reemplazarPorId(id, {
            id: id,
            nombre: 'put2',
            apellido: 'validId2',
            dni: '777',
            mail: 'ss@mail.com'
        })

        const buscado = await usu.buscarPorId(id)
        validarUsuario(buscado)
        if (buscado.edad == nuevaEdad) {
            console.log("put by existing id: ok")
            result = true
        } else {
            console.log("put by existing id: error - se encontró el mismo usuario sin reemplazar")
        }
    } catch (err) {
        console.log(err.message)
    } finally {
        try {
            await usu.borrarUsuario(idCreado)
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
        const { id } = await usu.crearUsuario(porCrear)
        idCreado = id
        await usu.borrarUsuario(id)

        await usu.reemplazarPorId(id, {
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
            await usu.borrarUsuario(idCreado)
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