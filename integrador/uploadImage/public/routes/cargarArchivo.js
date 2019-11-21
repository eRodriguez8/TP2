
const express = require('express')
const app = express();
const fileUpload = require('express-fileupload')
const router = require('express').Router()


app.use(express.static('public'))
app.use(fileUpload())

//const baseURI = './public/fotos/'
app.post('/upload',(req,res) => {
  let EDFile = req.files.file
  EDFile.mv(`./public/fotos ${EDFile.name}`,err => {
      if(err) return res.status(500).send({ message : err })

      return res.status(200).send({ message : 'Archivo subido correctamente' })
  })
})


module.exports= router, app