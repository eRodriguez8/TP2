const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const daoFactory = require('../data/daoFactory')

const baseURI = '/api/estudiantes'

router.get('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    try {
        const estudiantesDAO = daoFactory.getEstudiantesDAO()
        let result
        if (_.isEmpty(req.query)) {
            result = await estudiantesDAO.getAll()
        } else if (req.query.hasOwnProperty('dni') && !isNaN(req.query.dni)) {
            result = await estudiantesDAO.getByDni(req.query.dni)
        } else if (req.query.hasOwnProperty('edadMin') && !isNaN(req.query.edadMin) &&
            req.query.hasOwnProperty('edadMax') && !isNaN(req.query.edadMax)) {
            result = await estudiantesDAO.getByAge(req.query.edadMin, req.query.edadMax)
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
        const estudiantesDAO = daoFactory.getEstudiantesDAO()
        const estudianteBuscado = await estudiantesDAO.getById(req.params.id)

        if (!estudianteBuscado) {
            throw { status: 404, operacion: "GET/id", descripcion: 'estudiante no encontrado' }
        }
        res.json(estudianteBuscado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.post('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('POSTING: ' + baseURI + req.url)

    const nuevoEstu = req.body

    try {
        if (esEstudianteInvalido(nuevoEstu)) {
            throw { status: 400, operacion: "POST", descripcion: 'el estudiante posee un formato json invalido o faltan datos' }
        }

        const estudiantesDAO = daoFactory.getEstudiantesDAO()
        const buscado = await estudiantesDAO.getByDni(nuevoEstu.dni)
        if (buscado) {
            throw { status: 400, operacion: "POST", descripcion: 'ya existe un estudiante con ese dni' }
        }

        const estuCreado = await estudiantesDAO.add(nuevoEstu)
        res.status(201).json(estuCreado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        const estudiantesDAO = daoFactory.getEstudiantesDAO()
        await estudiantesDAO.deleteById(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.put('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('REPLACING: ' + baseURI + req.url)

    const nuevoEstu = req.body
    try {
        if (esEstudianteInvalido(nuevoEstu)) {
            throw { status: 400, operacion: "PUT", descripcion: 'el estudiante posee un formato json invalido o faltan datos' }
        }
        if (isNaN(req.params.id))
            throw { status: 400, operacion: "PUT", descripcion: 'el id provisto no es un número o es inválido' }

        if (nuevoEstu.id != req.params.id) {
            throw { status: 400, operacion: "PUT", descripcion: 'no coinciden los ids enviados' }
        }

        const estudiantesDAO = daoFactory.getEstudiantesDAO()
        const estuActualizado = await estudiantesDAO.updateById(req.params.id, nuevoEstu)

        res.json(estuActualizado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

function esEstudianteInvalido(estudiante) {
    const schema = {
        id: Joi.number().integer().min(0),
        nombre: Joi.string().alphanum().min(1).required(),
        apellido: Joi.string().alphanum().min(1).required(),
        edad: Joi.number().integer().min(0).max(120).required(),
        dni: Joi.number().integer().min(1).max(99999999).required(),
    }
    const { error } = Joi.validate(estudiante, schema);
    return error
}

module.exports = router
