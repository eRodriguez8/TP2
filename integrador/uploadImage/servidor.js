const express = require('express');
const app = express();
const fileUpload = require('express-fileupload')


app.use(express.static('public'))
app.use(fileUpload())


app.post('/upload',(req,res) => {
  let EDFile = req.files.file
  EDFile.mv(`./public/files/${EDFile.name}`,err => {
      if(err) return res.status(500).send({ message : err })

      return res.status(200).send({ message : 'File upload' })
  })
})



app.listen(3000, function(){
  console.log('Servidor iniciado');
})