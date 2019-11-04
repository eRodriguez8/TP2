const express = require('express')
const Joi = require('@hapi/joi')
const _ = require('lodash')

const app = express()

app.use(express.json())
app.set('json spaces', 4)

// base de datos

const estudiantes = []
let ultimoId = 0

// rutas

app.get('/api/estudiantes', (req, res) => {
    console.log('GETTING: ' + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = getAllEstudiantes()
        } else if (req.query.hasOwnProperty('dni')) {
            result = getEstudianteByDni(req.query.dni)
        } else if (req.query.hasOwnProperty('edadMin') &&
            req.query.hasOwnProperty('edadMax')) {
            result = getEstudiantesByRangoEdad(req.query.edadMin, req.query.edadMax)
        } else {
            throw { status: 400, descripcion: 'parametros de consulta invalidos' }
        }
        res.json(result)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.get('/api/estudiantes/:id', (req, res) => {
    console.log('GETTING: ' + req.url)

    try {
        const estudianteBuscado = getEstudianteById(req.params.id)

        if (!estudianteBuscado) {
            throw { status: 404, descripcion: 'estudiante no encontrado' }
        }
        res.json(estudianteBuscado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.post('/api/estudiantes', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevoEstu = req.body

    try {
        if (esEstudianteInvalido(nuevoEstu)) {
            throw { status: 400, descripcion: 'el estudiante posee un formato json invalido o faltan datos' }
        }
        const estudianteBuscado = getEstudianteByDni(nuevoEstu.dni)

        if (estudianteBuscado) {
            throw { status: 400, descripcion: 'ya existe un estudiante con ese dni' }
        }

        agregarEstudiante(nuevoEstu)

        res.status(201).json(nuevoEstu)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.delete('/api/estudiantes/:id', (req, res) => {
    console.log('DELETING: ' + req.url)

    try {
        eliminarEstudianteById(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(err.status).json(err)
    }

})

app.put('/api/estudiantes/:id', (req, res) => {
    console.log('REPLACING: ' + req.url)

    const nuevoEstu = req.body
    try {
        if (esEstudianteInvalido(nuevoEstu)) {
            throw { status: 400, descripcion: 'el estudiante posee un formato json invalido o faltan datos' }
        }
        if (nuevoEstu.id != req.params.id) {
            throw { status: 400, descripcion: 'no coinciden los ids enviados' }
        }

        reemplazarEstudianteById(nuevoEstu)
        res.json(nuevoEstu)
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

// Operaciones con la base de datos

function getAllEstudiantes() {
    return estudiantes
}

function getEstudianteByDni(dni) {
    return estudiantes.find(e => e.dni == dni)
}

function getEstudiantesByRangoEdad(edadMin, edadMax) {
    return estudiantes.filter(e => e.edad >= edadMin && e.edad <= edadMax)
}

function getEstudianteById(id) {
    return estudiantes.find(e => e.id == id)
}

function agregarEstudiante(estu) {
    estu.id = ultimoId + 1
    estudiantes.push(estu)
    ultimoId++
}

function eliminarEstudianteById(id) {
    const posBuscada = estudiantes.findIndex(e => e.id == id)
    if (posBuscada != -1) {
        estudiantes.splice(posBuscada, 1)
    } else {
        throw { status: 404, descripcion: 'estudiante no encontrado' }
    }
}

function reemplazarEstudianteById(estu) {
    const posBuscada = estudiantes.findIndex(e => e.id == estu.id)

    if (posBuscada == -1) {
        throw { status: 404, descripcion: 'estudiante no encontrado' }
    }
    estudiantes.splice(posBuscada, 1, estu)
    return estu
}


