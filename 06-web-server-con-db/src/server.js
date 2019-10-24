const express = require('express')
const app = express()

app.use(express.json())
app.set('json spaces', 4)

const estudiantesRouter = require('./routes/estudiantesRouter')
app.use('/api/estudiantes', estudiantesRouter)

const puerto = 8080
app.listen(puerto, () => {
    // eslint-disable-next-line no-console
    console.log(`servidor inicializado en puerto ${puerto}`)
})
