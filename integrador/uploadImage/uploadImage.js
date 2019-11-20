var http=require('http');
var url=require('url');
var fs=require('fs');
var formidable=require('formidable');

//const express = require('express');
//const app = express();

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);

//const puerto = 8080
//app.listen(puerto, () => {
   // console.log(`servidor inicializado en puerto ${puerto}`)
//})


app.get('/public/index.html',(req, res) => {
	console.log('GETTING: ' + req.url))
	if 

function encaminar (pedido,respuesta,camino) {
	
	switch (camino) {
		case 'public/subir': {
			subir(pedido,respuesta);
			break;
		}	
		case 'public/listadofotos': {
			listar(respuesta);
			break;
		}			
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}


function subir(pedido,respuesta){

	var entrada=new formidable.IncomingForm();
	entrada.uploadDir='upload';
	entrada.parse(pedido);
    entrada.on('fileBegin', function(field, file){
        file.path = "./public/upload/"+file.name;
    });	
    entrada.on('end', function(){
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
		respuesta.write('<!doctype html><html><head></head><body>'+
		                'Archivo subido<br><a href="index.html">Retornar</a></body></html>');		
		respuesta.end();
    });	
}

function listar(respuesta) {
  fs.readdir('./public/upload/',function (error,archivos){
	  var fotos='';
	  for(var x=0;x<archivos.length;x++) {
		  fotos += '<img src="upload/'+archivos[x]+'"><br>';
	  }
	  respuesta.writeHead(200, {'Content-Type': 'text/html'});
	  respuesta.write('<!doctype html><html><head></head><body>'+
	  fotos+
	  '<a href="index.html">Retornar</a></body></html>');		
	  respuesta.end();	  
  });	
}


console.log('Servidor web iniciado');