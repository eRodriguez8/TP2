const fs = require('fs')

/**
 * lee y devuelve el contenido de un archivo como texto en 'utf-8'
 * @param {string} ruta 
 * @return {string} el texto leído
 */
function leerArchivoComoString(ruta) {
    return fs.readFileSync(ruta, 'utf-8')
}

/**
 * escribe el texto en el archivo de la ruta, sólo si tal archivo existe. sino, lanza error.
 * @param {string} ruta 
 * @param {string} texto 
 */
function escribirTextoEnArchivo(ruta, texto, shouldCreateIfNotExists) {
    let modo = 'r+'
    if (shouldCreateIfNotExists) {
        modo = 'w'
    }
    fs.writeFileSync(ruta, texto, { flag: modo })
}

module.exports = {
    leerArchivoComoString,
    escribirTextoEnArchivo,
}