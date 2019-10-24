const estudiantesDAO_Arr = require('./daoEstudiantesArray')
const estudiantesDAO_DB = require('./daoEstudiantesDB')
const { mode } = require('../config')

function getEstudiantesDAO(){
    switch (mode) {
        case 'online': return estudiantesDAO_DB
        case 'offline': return estudiantesDAO_Arr
        default: throw "invalid mode. check system config!"
    }
}

module.exports = {
    getEstudiantesDAO
}