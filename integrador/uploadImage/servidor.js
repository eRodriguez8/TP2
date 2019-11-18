const express = require('express');
const app = express();

//const cargaFotos = require('./public/routes/cargarArchivo')
//app.use('./api',cargaFotos)
const baseURI= '/public/fotos'
const fileUpload = require('express-fileupload')
app.use(express.static('public'))
app.use(fileUpload())


app.post('/upload',(req,res) => {
  let EDFile = req.files.file
  EDFile.mv(`./public/fotos/ baseURI${EDFile.name}`,err => {
     if(err) return res.status(500).send({ message : err })

     return res.status(200).send({ message : 'Archivo subido correctamente' })
  })
})
const mostrarFoto = require('./public/routes/mostrarFoto')
app.use( './api',mostrarFoto)





app.listen(8080, function(){
  console.log('Servidor iniciado');
})