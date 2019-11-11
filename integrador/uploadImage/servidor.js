const express = require('express');
const app = express();


app.use(express.static('public'))
app.use(fileUpload())


app.post('/upload',(req,res) => {
  let EDFile = req.files.file
  EDFile.mv(`./public/fotos/${EDFile.name}`,err => {
      if(err) return res.status(500).send({ message : err })

      return res.status(200).send({ message : 'Archivo subido correctamente' })
  })
})

//const baseFotos = '/public/fotos'


app.get('/fotos/:name', function (req, res, next) {
    var options = {
      root: path.join(__dirname, 'public'),
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





app.listen(3000, function(){
  console.log('Servidor iniciado');
})