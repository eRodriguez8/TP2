const sendMail = require('./mail/index.js')
const email = 'tp2ort.integrador@gmail.com'
const mailDestino = 'ydeluqui@psa.com.ar'

async function testSendMailConSubject() {
    let result = false
    try {
        const mail = await sendMail.enviarMail(email, mailDestino, 'Hola Yamila')
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testSendMailConTexto() {
    let result = false
    try {
        const mail = await sendMail.enviarMail(email, mailDestino, '','Hola Yamila')
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testSendMailConSubjectConTexto() {
    let result = false
    try {
        const mail = await sendMail.enviarMail(email, mailDestino, 'Esto es un asunto', 'Esto es un texto')
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testSendMailConHtml() {
    let result = false
    let html = 
            '<p><b>Hola</b> sujeto</p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/>' + 
            '<img src="cid:nyan@example.com"/></p>'
    try {
        const mail = await sendMail.enviarMail(email, mailDestino, '', '', html)
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testSendMailConSubjectConTextoConHtml() {
    let result = false
    let html = 
            '<p><b>Hola</b> Yamila</p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/>' + 
            '<img src="cid:nyan@example.com"/></p>'
    try {
        const mail = await sendMail.enviarMail(email, mailDestino, 'Asunto', 'Puto el que lee', html)
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testSendMailConSubjectConTextoConHtmlConAdjunto() {
    let result = false
    let html = 
            '<p><b>Hola</b> Diego </p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/>' + 
            '<img src="cid:nyan@example.com"/></p>'
    let adjunto = [{
        filename: 'nyan cat ✔.gif',
        path: __dirname + '/mail/assets/nyan.gif',
        cid: 'nyan@example.com' 
    }]

    try {
        const mail = await sendMail.enviarMail(email, mailDestino, 'Prueba', 'Prueba2', html, adjunto)
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }

    return result
}

async function testSendMailConPlantilla() {
    let result = false
    let html = __dirname + '/mail/plantilla/plantilla.html'

    try {
        const mail = await sendMail.enviarMail(email, mailDestino, 'Mail', 'Plantilla abajo', html)
        console.log("email with text: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }

    return result
}

async function main() {
    let exitos = 0
    const tests = [
    //testSendMailConSubject,
    //tSendMailConTexto,
    //testSendMailConSubjectConTexto,
    //testSendMailConHtml,
    //  testSendMailConSubjectConTextoConHtml,
    testSendMailConSubjectConTextoConHtmlConAdjunto,
    // testSendMailConPlantilla
    ]

    for (const test of tests) {
        exitos += (await test()) ? 1 : 0
    }

    console.log(`\nresultado de las pruebas: ${exitos}/${tests.length}`)
}
setTimeout(main, 2000)