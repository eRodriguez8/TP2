const knex = require('../db/knex')

async function add(nuevo) {
    try {
        knex('gasto').insert(nuevo)

        const [nuevoId] = await knex('foto').insert(nuevo)
        nuevo.id = nuevoId
        return nuevo
    } catch (err) {
        throw { status: 500, operacion: "add", descripcion: err.message }
    }
}

//async function findByName(name) {
    //try {
     //   const result = await knex('gasto').where('id', id).del()
      //  if (result == 0) {
      //      throw { status: 404, operacion: "deleteById", descripcion: "no existe un gasto con el id dado" }
     //   }
     //   return
   // } catch (err) {
    //    if (err.status == 404) {
    //        throw err
    //    } else {
    //        throw { status: 500, operacion: "deleteById", descripcion: err.message }
    //    }
   // }
//}

module.exports = {
    findByName,
    add
    
}