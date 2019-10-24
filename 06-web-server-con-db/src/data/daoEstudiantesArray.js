const estudiantes = []
let proxId = 0

async function getAll() {
    return estudiantes
}

async function getByAge(edadMin, edadMax) {
    return filterByRange(estudiantes, 'edad', edadMin, edadMax)
}

function filterByRange(elems, campo, minVal, maxVal) {
    const result = []
    for (const elem of elems) {
        if (elem[campo] >= minVal && elem[campo] <= maxVal) {
            result.push(elem)
        }
    }
    return result
}

async function getByDni(dni) {
    return estudiantes.find(e => e.dni == dni)
}

async function getById(id) {
    return estudiantes.find(e => e.id == id)
}

async function add(estuNuevo) {
    const estudianteBuscado = await getByDni(estuNuevo.dni)
    if (estudianteBuscado)
        throw { status: 400, descripcion: 'ya existe un estudiante con ese DNI' }

    estuNuevo.id = proxId
    proxId++
    estudiantes.push(estuNuevo)
    return estuNuevo
}

async function deleteByDni(dni) {
    const posBuscada = estudiantes.findIndex(e => e.dni == dni)
    if (posBuscada == -1)
        throw { status: 404, description: 'estudiante no encontrado con ese DNI' }

    estudiantes.splice(posBuscada, 1)
}

async function deleteById(id) {
    const posBuscada = estudiantes.findIndex(e => e.id == id)
    if (posBuscada == -1)
        throw { status: 404, description: 'estudiante no encontrado con ese ID' }

    estudiantes.splice(posBuscada, 1)
}

async function updateByDni(dni, nuevoEstu) {
    const posBuscada = estudiantes.findIndex(e => e.dni == dni)
    if (posBuscada == -1)
        throw { status: 404, description: 'estudiante no encontrado con ese DNI' }

    estudiantes.splice(posBuscada, 1, nuevoEstu)
    return nuevoEstu
}

async function updateById(id, nuevoEstu) {
    const posBuscada = estudiantes.findIndex(e => e.id == id)
    if (posBuscada == -1)
        throw { status: 404, description: 'estudiante no encontrado con ese ID' }

    estudiantes.splice(posBuscada, 1, nuevoEstu)
    return nuevoEstu
}

module.exports = {
    getAll,
    getByAge,
    getByDni,
    getById,
    add,
    deleteByDni,
    deleteById,
    updateByDni,
    updateById
}
