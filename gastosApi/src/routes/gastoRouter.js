const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const service = require('../services/gastoService')

const baseURI = '/api/v1/gastos'
const baseURIFoto = '/api/v1/gastos/:id/fotos/upload/:name'

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

    const nuevoGasto = req.body

    try {
        if (esGastoInvalidoPost(nuevoGasto)) {
            throw { status: 400, operacion: "POST", descripcion: 'los datos del gasto son invalidos' }
        }

        const gastoCreado = await service.add(nuevoGasto)
        res.status(201).json(gastoCreado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        console.log("try")
        console.log(req.params.id)
        await service.deleteById(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.put('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('REPLACING: ' + baseURI + req.url)

    const nuevoGasto = req.body
    try {
        if (esGastoInvalido(nuevoGasto)) {
            throw { status: 400, operacion: "PUT", descripcion: 'el gasto posee un formato json invalido o faltan datos' }
        }
        if (isNaN(req.params.id))
            throw { status: 400, operacion: "PUT", descripcion: 'el id provisto no es un número o es inválido' }

        if (nuevoGasto.id != req.params.id) {
            throw { status: 400, operacion: "PUT", descripcion: 'no coinciden los ids enviados' }
        }

        const gastoActualizado = await service.updateById(req.params.id, nuevoGasto)

        res.json(gastoActualizado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

function esGastoInvalido(gasto) {
    const schema = {
        id: Joi.number().integer().min(0),
        monto: Joi.number().integer().min(1).required(),
        categoria: Joi.string().allow('').trim().strict().min(1).required(),
        descripcion: Joi.string().allow('').trim().strict().min(1).required(),
        fecha: Joi.string().allow('').trim().strict().min(1).required()
    }
    const { error } = Joi.validate(gasto, schema);
    return error
}

function esGastoInvalidoPost(gasto) {
    const schema = {
        monto: Joi.number().integer().min(1).required(),
        categoria: Joi.string().allow('').trim().strict().min(1).required(),
        descripcion: Joi.string().allow('').trim().strict().min(1).required(),
        fecha: Joi.string().allow('').trim().strict().min(1).required()
    }
    const { error } = Joi.validate(gasto, schema);
    return error
}

module.exports = router
