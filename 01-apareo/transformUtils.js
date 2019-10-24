/**
 * separa el string ante cada ocurrencia del separador, y agrega al array resultado siempre que pueda
 * transformar al fragmento de string en numero.
 * @param {string} str 
 * @param {string} separador
 * @returns {number[]} array de numeros
 */
function transformarStringEnArrayDeNumeros(str, separador) {
    const strings = str.split(separador)
    const numeros = []
    for (let s of strings) {
        if (s.length > 0 && !isNaN(s)) {
            numeros.push(parseInt(s))
        }
    }
    return numeros
}

/**
 * concatena todos los numeros entre sí, intercalando un separador entre número y número.
 * @param {number[]} arr 
 * @param {string} separador 
 * @returns {string} el nuevo string
 */
function transformarArrayDeNumerosAUnSoloString(arr, separador) {
    return arr.join(separador)
}

module.exports = {
    transformarStringEnArrayDeNumeros,
    transformarArrayDeNumerosAUnSoloString
}