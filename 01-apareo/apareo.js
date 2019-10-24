/**
 * toma dos arrays de números ordenados y en forma eficiente los combina en uno solo, aún ordenado
 * @param {number[]} arrA un array de números ordenados
 * @param {number[]} arrB otro array de números ordenados
 * @returns {number[]} un nuevo array de números ordenados
 */
function combinarDosArrays(arrA, arrB) {
    const combinado = []

    let indexA = 0
    let indexB = 0

    while (indexA < arrA.length || indexB < arrB.length) {
        if (indexA >= arrA.length) {
            combinado.push(arrB[indexB])
            indexB++
        } else if (indexB >= arrB.length) {
            combinado.push(arrA[indexA])
            indexA++
        } else if (arrA[indexA] < arrB[indexB]) {
            combinado.push(arrA[indexA])
            indexA++
        } else if (arrB[indexB] < arrA[indexA]) {
            combinado.push(arrB[indexB])
            indexB++
        } else {
            combinado.push(arrA[indexA])
            indexA++
            indexB++
        }
    }
    return combinado
}

/**
 * toma un array de muchos arrays de números ordenados y los combina en uno solo, aún ordenado
 * @param {number[][]} arrs el array de arrays de números que quiero combinar
 * @returns {nuber[]} el nuevo array de números ordenados
 */
function combinarNArrays(arrs) {

    const combinado = []

    const indices = new Array(arrs.length)
    for (let i = 0; i < indices.length; i++) {
        indices[i] = 0
    }

    const valores = new Array(arrs.length)
    for (let i = 0; i < valores.length; i++) {
        if (indices[i] < arrs[i].length){
            valores[i] = arrs[i][indices[i]]
        } else {
            valores[i] = Infinity
        }
    }

    let minIndice = findMin(valores)

    while (valores[minIndice] != Infinity) {
        combinado.push(valores[minIndice])
        actualizarIndicesYValores(indices, valores, arrs, valores[minIndice])
        minIndice = findMin(valores)
    }
    return combinado
}

function findMin(valores){
    let minIndice = 0
    for (let i = 0; i < valores.length; i++) {
        if (valores[i] < valores[minIndice]) {
            minIndice = i
        }
    }
    return minIndice
}

function actualizarIndicesYValores(indices, valores, arrs, min) {
    for (let i = 0; i < indices.length; i++) {
        if (valores[i] == min){
            indices[i]++
            if (indices[i] < arrs[i].length){
                valores[i] = arrs[i][indices[i]]
            } else {
                valores[i] = Infinity
            }
        }
    }
}

module.exports = {
    combinarDosArrays,
    combinarNArrays
}