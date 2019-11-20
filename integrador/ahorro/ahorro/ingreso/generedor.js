[
    '{{repeat(50, 60)}}',
    { indice: '{{index()}}',
      monto: '{{floating(100, 4000, 2, "$0,0.00")}}',
      
      categoria: '{{random("ocio", "servicio", "tarjeta","comida", "hogar")}}',
     descripcion: '{{random("a", "b", "d","c", "e")}}',
       
       
      
     
          
      periodico: '{{bool()}}',
      prioridad: '{{random(1, 2, 3,4,5)}}',
      fecha: '{{date(new Date(2019, 0, 1), new Date(), "YYYY-MM-dd")}}'
     
    }]
  
  