const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const UsuarioService = require('../services/usuarioService')

const baseURI = '/api/v1/usuarios'

router.get('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = await UsuarioService.getAll()
        } else {
            throw { status: 400, operacion: "GET", descripcion: 'parametros de consulta invalidos' }
        }
        res.json(result)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.get('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)

    try {
        const usuarioBuscado = await UsuarioService.getById(req.params.id)
        if (!usuarioBuscado) {
            throw { status: 404, operacion: "GET/id", descripcion: 'usuario no encontrado' }
        }
        res.json(usuarioBuscado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.post('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('POSTING: ' + baseURI + req.url)

    const nuevoUsuario = req.body

    try {
        if (esUsuarioInvalidoPost(nuevoUsuario)) {
            throw { status: 400, operacion: "POST", descripcion: 'el usuario posee un formato json invalido o faltan datos' }
        }

        const usuarioCreado = await UsuarioService.add(nuevoUsuario)
        res.status(201).json(usuarioCreado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        await UsuarioService.deleteById(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.put('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('UPDATING: ' + baseURI + req.url)

    const nuevoUsuario = req.body
    try {
        if (esUsuarioInvalido(nuevoUsuario)) {
            throw { status: 400, operacion: "PUT", descripcion: 'el estudiante posee un formato json invalido o faltan datos' }
        }
        if (isNaN(req.params.id)){
            throw { status: 400, operacion: "PUT", descripcion: 'el id provisto no es un número o es inválido' }
        }
        if (nuevoUsuario.id != req.params.id) {
            throw { status: 400, operacion: "PUT", descripcion: 'no coinciden los ids enviados' }
        }

        const usuarioActualizado = await UsuarioService.updateById(req.params.id, nuevoUsuario)

        res.json(usuarioActualizado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

function esUsuarioInvalido(usuario) {
    const schema = {
        id: Joi.number().integer().min(0),
        nombre: Joi.string().alphanum().min(1).required(),
        apellido: Joi.string().alphanum().min(1).required(),
        dni: Joi.number().integer().min(1).max(999999999).required(),
        mail: Joi.string().email().min(1).required()
    }
    const { error } = Joi.validate(usuario, schema);
    return error
}

function esUsuarioInvalidoPost(usuario) {
    const schema = {
        nombre: Joi.string().alphanum().min(1).required(),
        apellido: Joi.string().alphanum().min(1).required(),
        dni: Joi.number().integer().min(1).max(999999999).required(),
        mail: Joi.string().email().min(1).required()
    }
    const { error } = Joi.validate(usuario, schema);
    return error
}

module.exports = router
