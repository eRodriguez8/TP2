
const express = require('express');
const app = express();
const router = require('express').Router()
const fileUpload = require('express-fileupload')
app.use(fileUpload())
const baseURI = '/api/v1/fotos'

router.get('/:name', function (req, res, next) {
    var options = {
      //root: path.join(baseURI, 'routes'),
      root: 'public',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
     } else {
        console.log('Sent:', fileName)
      }
    })
  })

  router.post('/',(req,res) => {
    let EDFile = req.files.file
    EDFile.mv(`./src/repositories/fotos${EDFile.name}`,err => {
        if(err) return res.status(500).send({ message : err })
  
        return res.status(200).send({ message : 'Archivo subido correctamente' })
    })
  })




  module.exports= router, app