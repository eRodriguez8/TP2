
const baseURI = '/api/v1/fotos'

router.get('/:name', function (req, res, next) {
    var options = {
      root: path.join(baseURI, 'public'),
      //root: 'public',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }

router.get('/:id', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('GETTING: ' + baseURI + req.url)

    try {
        const estudiantesDAO = daoFactory.getEstudiantesDAO()
        const estudianteBuscado = await estudiantesDAO.getById(req.params.id)

        if (!estudianteBuscado) {
            throw { status: 404, operacion: "GET/id", descripcion: 'estudiante no encontrado' }
        }
        res.json(estudianteBuscado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.post('/', async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('POSTING: ' + baseURI + req.url)
    
    let EDFile = req.files.file

    try {
        EDFile.mv(`./public/fotos${EDFile.name}`,err => {
            if(err) 
                return res.status(500).send({ message : err })
      
            return res.status(200).send({ message : 'Archivo subido correctamente' })
        })
    } catch (err) {
        res.status(err.status).json(err)
    }
})


