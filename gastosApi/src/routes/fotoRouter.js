const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const service = require('../services/fotoService')

const baseURI = '/api/v1/fotos'

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
    
    let EDFile = req.files.file

    try {
        EDFile.mv(`./public/fotos${EDFile.name}`,err => {
            if(err) 
                return res.status(500).send({ message : err })
      
            return res.status(200).send({ message : 'Archivo subido correctamente' })
        })
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
