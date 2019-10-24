const apareo = require('./apareo.js')
const fUtils = require('./fileUtils')
const transform = require('./transformUtils')

// cargos todos los archivos en memoria
const setA = fUtils.leerArchivoComoString('./in/10NumerosOrdenadosEntre1y50(setA).in')
const setB = fUtils.leerArchivoComoString('./in/10NumerosOrdenadosEntre1y50(setB).in')
const setC = fUtils.leerArchivoComoString('./in/imparesOrdenadosEntre1y999.in')
const setD = fUtils.leerArchivoComoString('./in/paresOrdenadosEntre2y1000.in')

// preparo 4 arrays para aparear
const numsA = transform.transformarStringEnArrayDeNumeros(setA, ',')
const numsB = transform.transformarStringEnArrayDeNumeros(setB, ',')
const numsC = transform.transformarStringEnArrayDeNumeros(setC, ',')
const numsD = transform.transformarStringEnArrayDeNumeros(setD, ',')

// apareo simple 
const combinado = apareo.combinarDosArrays(numsA, numsB)
const combinadoComoTexto = transform.transformarArrayDeNumerosAUnSoloString(combinado, ',')
fUtils.escribirTextoEnArchivo('./out/combinado.out', combinadoComoTexto, true)

// armo un array con los 4 arrays que quiero aparear
const arrs = [numsA, numsB, numsC, numsD]

// apareo múltiple
const combinado2 = apareo.combinarNArrays(arrs)
const combinadoComoTexto2 = transform.transformarArrayDeNumerosAUnSoloString(combinado2, ',')
fUtils.escribirTextoEnArchivo('./out/combinado2.out', combinadoComoTexto2, true)