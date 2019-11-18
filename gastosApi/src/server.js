const express = require('express')
const app = express()

app.use(express.json())
//app.use(express.static('src'))
//app.use('/static', express.static('src'));
app.use('/repo', express.static(__dirname + '/repositories/fotos'))

const gastoRouter = require('./routes/gastoRouter')
const sueldoRouter = require('./routes/sueldoRouter')
const usuarioRouter = require('./routes/usuarioRouter')
 const fotoRouter = require('./routes/fotoRouter')

app.use('/api/v1/gastos', gastoRouter)
app.use('/api/v1/sueldos', sueldoRouter)
app.use('/api/v1/usuarios', usuarioRouter)
 app.use('/api/v1/fotos', fotoRouter)

const puerto = 5000
app.listen(puerto, () => {
    // eslint-disable-next-line no-console
    console.log(`servidor inicializado en puerto ${puerto}`)
})
