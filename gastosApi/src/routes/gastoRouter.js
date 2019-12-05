const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const fs = require('fs')

const GastoService = require('../services/gastoService')
const FotosService = require('../services/fotoService')

const baseURI = '/api/v1/gastos'

router.get('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = await GastoService.getAll()
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
        const gastoBuscado = await GastoService.getById(req.params.id)
        if (!gastoBuscado) {
            throw { status: 404, operacion: "GET/id", descripcion: 'gasto no encontrado' }
        }
        res.json(gastoBuscado)
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

        const gastoCreado = await GastoService.add(nuevoGasto)
        res.status(201).json(gastoCreado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        await GastoService.deleteById(req.params.id)
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

        const gastoActualizado = await GastoService.updateById(req.params.id, nuevoGasto)

        res.json(gastoActualizado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.get('/:id/fotos/:name', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    let uploadPath = __dirname + '/../repositories/fotos/'
    var options = {
        root: uploadPath,
        dotfiles: 'deny',
        headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
        }
    }

    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
        if (err) {
            res.status(404).send(err)
            console.log('\n Error')
        } else {
            console.log('Sent:', fileName)
        }
    })
})

router.delete('/:id/fotos/:name', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        let fileName = req.params.name
        const path = __dirname + '/../repositories/fotos/' + fileName
        let idGasto = req.params.id

        await FotosService.deleteByPath(idGasto, path)

        fs.unlink(path, (err) => {
            if (err) {
                return res.status(404).send(err)
            } else {
                res.status(204).send('File: ' + fileName + ' Removed!')
            }
        })
    } catch (error) {
        res.status(error.status).json(error)
    }
})

router.post('/:id/fotos/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('POSTING: ' + baseURI + req.url)

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
    }

    let sampleFile = req.files.files
    let name = sampleFile.name
    let uploadPath = __dirname + '/../repositories/fotos/' + name
    let idGasto = req.params.id

    const nuevaFoto = {
        nombre: name,
        ruta: uploadPath
    }

    const fotoCreada = await FotosService.add(idGasto, nuevaFoto)

    sampleFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err)

        //res.send('File uploaded!')
        res.status(201).json(fotoCreada)
    })
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
