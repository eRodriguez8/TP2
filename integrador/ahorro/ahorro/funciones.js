var fechaActual = new Date();

function leerArray(gasto){
}

function leerArray(gasto){
}

var fechaActual = new Date();

var resultado = fechauno.getTime() === fechados.getTime();

function toMs(dateStr) {
    // desarmamos el string por los '-' los descartamos y lo transformamos en un array
    let parts = dateStr.split("-")
    // parts[2] es año
    // parts[1] el mes
    // parts[0] el día
    return new Date(parts[2], parts[1] - 1, parts[0]).getTime()

    let preDate = toMS("8-11-2018")
let postDate = toMS("10-11-2018")
let filteredAccounts = accounts.filter(function(account){
  return toMs(account.date) > preDate && toMs(account.date) < postDate
})