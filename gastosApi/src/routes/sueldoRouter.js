const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const service = require('../services/sueldoService')

const baseURI = '/api/v1/sueldos'

router.get('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = await service.getAll()
        } else {
            throw { status: 400, operacion: "GET", descripcion: 'parametros de consulta invalidos' }
        }
        res.json(result)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.post('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('POSTING: ' + baseURI + req.url)

    const nuevoSueldo = req.body
    try {
        if (esSueldoInvalidoPost(nuevoSueldo)) {
            throw { status: 400, operacion: "POST", descripcion: 'los datos del sueldo son invalidos' }
        }

        const sueldoCreado = await service.add(nuevoSueldo)
        res.status(201).json(sueldoCreado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        await service.deleteById(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.put('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('REPLACING: ' + baseURI + req.url)

    const nuevoSueldo = req.body
    try {
        if (esSueldoInvalido(nuevoSueldo)) {
            throw { status: 400, operacion: "PUT", descripcion: 'el sueldo posee un formato json invalido o faltan datos' }
        }
        if (isNaN(req.params.id))
            throw { status: 400, operacion: "PUT", descripcion: 'el id provisto no es un número o es inválido' }

        if (nuevoSueldo.id != req.params.id) {
            throw { status: 400, operacion: "PUT", descripcion: 'no coinciden los ids enviados' }
        }

        const sueldoActualizado = await service.updateById(req.params.id, nuevoSueldo)

        res.json(sueldoActualizado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

function esSueldoInvalido(sueldo) {
    const schema = {
        id: Joi.number().integer().min(0),
        monto: Joi.number().integer().min(1).required(),
        descripcion: Joi.string().allow('').trim().strict().min(1).required(),
        fecha: Joi.string().allow('').trim().strict().min(1).required()
    }
    const { error } = Joi.validate(sueldo, schema);
    return error
}

function esSueldoInvalidoPost(sueldo) {
    const schema = {
        monto: Joi.number().integer().min(1).required(),
        descripcion: Joi.string().allow('').trim().strict().min(1).required(),
        fecha: Joi.string().allow('').trim().strict().min(1).required()
    }
    const { error } = Joi.validate(sueldo, schema);
    return error
}

module.exports = router
