const express = require('express')
const app = express()
const fileUpload = require('express-fileUpload')

app.use(express.json())
app.use(fileUpload())

const gastoRouter = require('./routes/gastoRouter')
const sueldoRouter = require('./routes/sueldoRouter')
const usuarioRouter = require('./routes/usuarioRouter')

app.use('/api/v1/gastos', gastoRouter)
app.use('/api/v1/sueldos', sueldoRouter)
app.use('/api/v1/usuarios', usuarioRouter)

const puerto = 5000
app.listen(puerto, () => {
    // eslint-disable-next-line no-console
    console.log(`servidor inicializado en puerto ${puerto}`)
})
