const fs = require('fs')
const util = require('util')

/**
 * ordena (in place) una coleccion de datos segun las claves provistas.
 * @param {Object[]} coleccion el array que quiero ordenar
 * @param {string[]} claves las claves por las que quiero ordenar, por orden de importancia
 */
function ordenar(coleccion, claves) {
    coleccion.sort((obj1, obj2) => {
        let result = 0
        let keepComparing = true
        let i = 0
        while (keepComparing && i < claves.length) {
            if (obj1[claves[i]] < obj2[claves[i]]) {
                result = -1
                keepComparing = false
            } else if (obj1[claves[i]] > obj2[claves[i]]) {
                result = 1
                keepComparing = false
            } else {
                i++
            }
        }
        return result
    })
}

/**
 * recibe las rutas del archivo de deudas original, archivo de pagos, archivo de deudas con las actualizaciones, y archivo de log para registrar errores o advertencias.
 * @param {string} rutaDeudasOld 
 * @param {string} rutaPagos 
 * @param {string} rutaDeudasNew 
 * @param {string} rutaLog 
 */
function actualizarArchivosDeudas(rutaDeudasOld, rutaPagos, rutaDeudasNew, rutaLog) {
    const deudasStrIn = fs.readFileSync(rutaDeudasOld, 'utf-8')
    const deudasObjs = JSON.parse(deudasStrIn)
    ordenar(deudasObjs, ['dni'])

    const pagosStrIn = fs.readFileSync(rutaPagos, 'utf-8')
    const pagosObjs = JSON.parse(pagosStrIn)
    ordenar(pagosObjs, ['dni', 'fecha'])
    
    const deudasObjsNew = actualizarDeudas(deudasObjs, pagosObjs, logMsg => {
        fs.appendFileSync(rutaLog, logMsg)
    })

    const deudasStrOut = JSON.stringify(deudasObjsNew, null, 4)
    fs.writeFileSync(rutaDeudasNew, deudasStrOut)
}

/**
 * @callback loggerCallback 
 * @param {string} error error message to display
 */

/**
 * realiza el apareo con actualizacion entre deudas y pagos, y loguea algunos eventos relevantes.
 * @param {Object[]} deudas las deudas originales
 * @param {Object[]} pagos los pagos a aplicar
 * @param {loggerCallback} logger funcion a la cual llamar en caso de necesitar loguear un evento
 * @returns {Object[]} las deudas actualizadas
 */
function actualizarDeudas(deudas, pagos, logger) {
    let i = 0
    let j = 0

    const actualizado = []

    while (i < deudas.length || j < pagos.length) {
        if (i >= deudas.length) { // se acabaron las deudas pero quedan pagos: error!
            logger(armarMsgPagoSinDeudaAsociada(pagos[j]))
            j++
        } else if (j >= pagos.length) { // se acabaron los pagos pero quedan deudas
            actualizado.push(deudas[i])
            i++
        } else if (deudas[i].dni < pagos[j].dni) { // deuda sin [mas] pagos
            if (deudas[i].debe < 0) {
                logger(armarMsgPagoDeMas(deudas[i]))
            } else if (deudas[i].debe > 0) {
                actualizado.push(deudas[i])
            }
            i++
        } else if (pagos[j].dni < deudas[i].dni) { // pago sin deuda: error! 
            logger(armarMsgPagoSinDeudaAsociada(pagos[j]))
            j++
        } else { // coincide el dni
            if (pagos[j].apellido != deudas[i].apellido) {
                logger(armarMsgPagoConDatosErroneos(deudas[i], pagos[j]))
            } else { // coincide dni y apellido
                deudas[i].debe -= pagos[j].pago
            }
            j++
        }
    }
    return actualizado
}

/**
 * arma un mensaje informando los detalles de un pago que no corresponde a ninguna deuda 
 * @param {Object} pago el pago sin deuda correspondiente
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoSinDeudaAsociada(pago) {
    const logMsg = `
el siguiente pago no corresponde a ninguna deuda:
${util.inspect(pago)}

=================================
`
    return logMsg
}

/**
 * arma un mensaje indicando el dni del sujeto que pagó de más, y cuanto dinero quedó a su favor
 * @param {Object} deuda la deuda con excedente de pago
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoDeMas(deuda) {
    const logMsg = `
dni: ${deuda.dni} posee $${Math.abs(deuda.debe)} a su favor

=================================
`
    return logMsg
}

/**
 * arma un mensaje mostrando la deuda, y el pago que no se pudo concretar, y notifica que el registro permanece sin cambios.
 * @param {Object} deuda 
 * @param {Object} pago
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoConDatosErroneos(deuda, pago) {
    const logMsg = `
error al querer actualizar esta deuda:
${util.inspect(deuda)}
con este pago:
${util.inspect(pago)}

se mantiene el registro original sin cambios

=================================
`
    return logMsg
}

module.exports = {
    actualizarArchivosDeudas
}
