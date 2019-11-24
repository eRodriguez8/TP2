
const _ = require('lodash')
const express = require('express')
const router = require('express').Router()
const app = express()
const fileUpload = require('express-fileUpload')
const FotosService = require('../services/fotoService')

app.use(fileUpload())

const baseURI = '/api/v1/fotos'

router.get('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    const id = req.params.id
    try {
        let id = FotosService.getById(id)
        res.json(id)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.get('/:name', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)
    const name = req.params.name
    try {
        let file = FotosService.getByName(name)
        if(file){
            let options = {
                root: 'public',
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            }

            res.sendFile(file, options, function (err) {
                if (err){
                    next(err)
                } else {
                    res.status(200).send()
                }
            })

        } else {
            throw { status: 404, operacion: "GET/name", descripcion: 'foto no encontrada' }
        }
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.delete('/:name', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('DELETING: ' + baseURI + req.url)

    try {
        const name = req.params.name
        let fotoBorrada = FotosService.deleteByName(name)

        if(fotoBorrada){
            res.status(204).send()
        } else {
            throw { status: 404, operacion: "GET/name", descripcion: 'foto no encontrada' }
        }
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.post('/upload', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('POSTING: ' + baseURI + req.url)

    try {
        const nuevaFoto = req.files.file
        let fotoCreada = FotosService.add(nuevaFoto)
        res.status(201).json(fotoCreada)
    } catch (err) {
        res.status(err.status).json(err)
    }
})


module.exports = router
