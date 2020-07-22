const actions = require('./actions');
const sendAPI = require('./graphAPI');
var SolicitudPrimera = require('../controllers/solicitud');

exports.handleMessage = async (webhookEvent) => {
            
    if (webhookEvent.message) {
        let mensaje = webhookEvent.message;
        if (mensaje.quick_reply) {
        //console.log('envio respuesta rapida como un clic boton');
            handlequickReplies(webhookEvent);
        }
        else if (mensaje.attachments) {
            //console.log('se envio un adjunto');
            actions.ubicacion(webhookEvent);
        }
        else if (mensaje.text) {
           // actions.sendTextMessage('has enviado texto', webhookEvent);
            handleNlp(webhookEvent);
        }
         
    }
    else if (webhookEvent.postback) {
            // console.log('postback, encuesta info inicio');
            handlePostback(webhookEvent);
        }
         
    
}


handlePostback = async (webhookEvent) => {
    console.log(webhookEvent, '>>>>>>>>>>>>>>>>>>>')
    let evento = webhookEvent.postback.payload;
    switch (evento) {
        case 'BuscPlaces':
           // console.log('se eligio las encuestas ');
           // actions.quickReplies(webhookEvent)
           actions.OptionSearch(webhookEvent)
            break;


        case 'infoOf':
           // handleLocation(webhookEvent);
           // actions.sendTextMessage('oprimiste mas info', webhookEvent);
            actions.InfoOF(webhookEvent)
            break;

        case 'inicio':
         
            sendAPI.getProfile(webhookEvent.sender.id).then( Profile =>{
                //guardar perfil en mongo
                //actions.sendTextMessage('Hola '+Profile.first_name+' Binevenid@ a ordenofacil, estoy para servirte aqui te dejo unas opciones ', webhookEvent);
                actions.optionInicio(webhookEvent, Profile)
           
            });
            break;
        

    }
    
    try{
        console.log(evento, evento.type, evento.type != undefined,typeof(evento))
        let event = JSON.parse(evento)
        if(event.type != undefined){
        
            handleNlp(webhookEvent)
        }
    }
    catch(ex){
console.log(ex)
    }
   
}

handlequickReplies = (webhookEvent) => {
    let reply = webhookEvent.message.quick_reply.payload;
    if (reply == 'servicio' || reply == 'rapidez'  || reply == 'ubicacion') {
    const response = {
        texto: 'Nos recomendarias?',
        replies: [{
            content_type: 'text',
            title: 'Si',
            payload: 'sirecomiendo'
        },
        {
            content_type: 'text',
            title: 'No',
            payload: 'Norecomiendo'
        }]
    }
    
        actions.quickReplies(webhookEvent, response);
    }
    if (reply == 'sirecomiendo' || reply == 'Norecomiendo') {
        actions.sendTextMessage('Gracias por ayudarnos a mejorar', webhookEvent);
    }
    if (reply == 'BuscPlaces' ){
        actions.OptionSearch(webhookEvent)

    }
    if(reply == 'nearMe' ){
        actions.sendTextMessage('por favor comparteme tu codigo postal', webhookEvent)
}

if(reply == 'namePlaces' ){
    actions.sendTextMessage('Que lugar estas buscando? contestame como en el siguiente ejemplo: "nombre:Asado ', webhookEvent)
}
if(reply == 'namePlato' ){
    actions.sendTextMessage('Que se te antoja comer? contestame como en el siguiente ejemplo: "producto:Hamburguesas" ', webhookEvent)
}

if(reply == 'infoOf'){
    actions.InfoOF(webhookEvent)
}

if(reply == 'prodOF'){
    //actions.sendTextMessage('Nuestros productos se dividen en 2, gratuitos y de paga; \n - gratuitos: \n- pagina y app movil: En tu pagina puedes cargar hasta 30 platillos con imagen, descripcion y precios\n - subir eventos, promociones especiales y/o paquetes, subir info de tu negocio (ubicacion, horarios, telefonos, redes sociales...). \n  - Acceso a tablero de control. \n - Si lo deseas puedes recibir comandas desde la pagina y darles seguimiento desde tu tablero. \n este es un ejemplo:\n https://comandaof.web.app/menu/dnE6XnhrjrU_/U--8XWEEwSQ_  \n Nota* en la opcion de paga desaparecen las restricciones ', webhookEvent)
    actions.prodInfoFree(webhookEvent)
    
}

if(reply == 'showProdCosto'){
    actions.sendTextMessage('De paga: \n - Recibir ordenes a domicilio: cuando un cliente no puede acudir a tu negocio pero tienes reparto a domicilio este plan es para ti, recibiras comandas con la ubicacion del cliente \n - Reservaciones: los clientes podran reservar una mesa \n - Encuestas: si lo deseas puedes incluir una ligera encuesta en tu pagina ideal para lealtad \n - Programa de lealtad: si un cliente es frecuente puedes premiarlo. \n - Difusion: envia notificaciones push o email a clientes que ya te visitaron. registrate gratis en \n ordenofacil.com/Registro.aspx \no visita: ordenofacil.com/cotizacion.aspx \n Nota* todos nuestros planes se contratan por separado y al contratar algun plan en tu pagina no aparece publicidad y la restriccion de platillos y comandas desaparece ', webhookEvent)
}

if(reply == 'priceOF'){
    actions.sendTextMessage('OrdenoFacil tiene una version gratuita pero limitada, al contratar cualquier producto accedes a la version full de OrdenoFacil, para mayor informacion de precios visita: \nordenofacil.com/cotizacion.aspx  ')
}


}



handleLocation = (webhookEvent) => {
  /*   const replyLocation = {
        title: 'por favor compartenos tu codigo postal',
        content_type:'text',
        payload: 'CodigoPostal'

    }
    actions.quickReplies(webhookEvent, replyLocation); */
    //actions.sendTextMessage('por favor comparteme tu codigo postal')
    // hayq ue agarrar un local y mostrarlo en las cards
}

handleNlp=(webhookEvent)=>{
    console.log(webhookEvent.message,']]]]]]]]]]]]]]]]]]]]]')
    if(webhookEvent.message != undefined){
    let nlp=webhookEvent.message.nlp;
    if(nlp.entities.mensaje)
    {
            if(nlp.entities.mensaje[0].value=='servicioDomicilio'){
                actions.sendTextMessage('si tenemos restaurantes asi', webhookEvent);
            }

            else{
                
                let evento = null
                let type = 0
              if(webhookEvent.postback != undefined){
                 evento = JSON.parse(webhookEvent.postback.payload);
                 console.log(evento,'////////////////////////')
                 if(evento)
                 type = evento.type
              }
                let texto = webhookEvent.message.text

        if(texto.toLowerCase().includes('nombre') || (evento != null && type == 1)){
            let namer = ''            
            let count = 0
            if(evento != null)
            {
                namer = evento.search     
                count = evento.skip           
            }
            else{
            let name = texto.split(':')
            namer = name[1]
            }
            sendAPI.getLocalesByNameProduct(1,namer, count).then( Locals =>{
                
                if(Locals.length > 0){
                    let locales = actions.templatesLocales(Locals, 1, namer, count)                                  
                      actions.ubicacion(webhookEvent ,locales)
                    }
                    else
                    actions.sendTextMessage('No se encontraron resultados con este nombre:'+namer, webhookEvent);
            })
        }
        if(texto.toLowerCase().includes('producto')|| (evento != null && type == 2)){
            let namer = ''            
            let count = 0
            if(evento != null)
            {
                namer = evento.search     
                count = evento.skip           
            }
            else{
            let name = texto.split(':')
            namer = name[1]
            }
            
            sendAPI.getLocalesByNameProduct(2,namer, count).then( Locals =>{        
                if(Locals.length > 0){        
                let locales = actions.templatesLocales(Locals, 2, namer, count)                  
                  actions.ubicacion(webhookEvent ,locales)
                }
                else
                actions.sendTextMessage('No se encontraron resultados para este producto:'+namer, webhookEvent);
            })
        }
            }
    }
    else{
        console.log(webhookEvent,'////////////////////////2')
        let evento = null
        let type = 0
      if(webhookEvent.postback != undefined){
         evento = JSON.parse(webhookEvent.postback.payload);
         type = evento.type
      }
        let texto = webhookEvent.message.text

    
        if(texto.toLowerCase().includes('nombre')|| (evento != null && type == 1)){
            let namer = ''            
            let count = 0
            if(evento != null)
            {
                namer = evento.search     
                count = evento.skip           
            }
            else{
            let name = texto.split(':')
            namer = name[1]
            }
            sendAPI.getLocalesByNameProduct(1,namer, count).then( Locals =>{
                if(Locals.length > 0){
                let locales = actions.templatesLocales(Locals, 1, namer, count)                                  
                  actions.ubicacion(webhookEvent ,locales)
                }
                else
                actions.sendTextMessage('No se encontraron resultados con este nombre:' +namer, webhookEvent);
            })
        }
        if(texto.toLowerCase().includes('producto')|| (evento != null && type == 2)){
            let namer = ''            
            let count = 0
            if(evento != null)
            {
                namer = evento.search     
                count = evento.skip           
            }
            else{
            let name = texto.split(':')
            namer = name[1]
            }
            
            sendAPI.getLocalesByNameProduct(2,namer, count).then( Locals =>{   
                if(Locals.length > 0){             
                let locales = actions.templatesLocales(Locals, 2, namer, count)                  
                  actions.ubicacion(webhookEvent ,locales)
                }
                else
                actions.sendTextMessage('No se encontraron resultados para este producto:'+namer, webhookEvent);
            })
        }
        var pasacel = parseInt(texto);
        if(!isNaN(pasacel) && isFinite(pasacel) || (evento != null && type == 3)){
            if(texto.length === 5 || evento.search){
                let count =0
                if(evento != null){
                texto = evento.search
                count = evento.skip
                }

               actions.getCoordinates(texto).then(response =>{
                   
                   if(response.results.length > 0){
                   let location = response.results[0].geometry.location
                   
                  sendAPI.getActivesOut(location.lat, location.lng, count).then(Locals =>{
                  if(Locals.length > 0){
                  let locales = actions.templatesLocales(Locals, 3, texto, count)                  
                  actions.ubicacion(webhookEvent ,locales)

                  if(Locals.length > 4)
                  actions.cargarMas(webhookEvent, 1)
                  }
                  else
                  actions.sendTextMessage('No tenemos lugares de comida en este CP, si lo deseas puedes buscar, por nombre del establecimiento o por platillo', webhookEvent);
                })
                   }
                   else{
                    actions.sendTextMessage('No tenemos lugares de comida en este CP, si lo deseas puedes buscar, por nombre del establecimiento o por platillo', webhookEvent);
                   }
               })     
            }
            else
            actions.sendTextMessage('Disculpa no entiendo', webhookEvent);

        }    
        else
        actions.sendTextMessage('Disculpa no entiendo ', webhookEvent);
    }
}    
    else{
        console.log(webhookEvent,'////////////////////////2')
        let evento = null
        let type = 0
        let texto = ''
      if(webhookEvent.postback != undefined){
         evento = JSON.parse(webhookEvent.postback.payload);
         type = evento.type
      }
    else
         texto = webhookEvent.message.text

    
        if(texto.toLowerCase().includes('nombre')|| (evento != null && type == 1)){
            let namer = ''            
            let count = 0
            if(evento != null)
            {
                namer = evento.search     
                count = evento.skip           
            }
            else{
            let name = texto.split(':')
            namer = name[1]
            }
            sendAPI.getLocalesByNameProduct(1,namer, count).then( Locals =>{
                if(Locals.length > 0){
                let locales = actions.templatesLocales(Locals, 1, namer, count)                                  
                  actions.ubicacion(webhookEvent ,locales)
                }
                else
                actions.sendTextMessage('No se encontraron resultados con este nombre:' +namer, webhookEvent);
            })
        }
        if(texto.toLowerCase().includes('producto')|| (evento != null && type == 2)){
            let namer = ''            
            let count = 0
            if(evento != null)
            {
                namer = evento.search     
                count = evento.skip           
            }
            else{
            let name = texto.split(':')
            namer = name[1]
            }
            
            sendAPI.getLocalesByNameProduct(2,namer, count).then( Locals =>{   
                if(Locals.length > 0){             
                let locales = actions.templatesLocales(Locals, 2, namer, count)                  
                  actions.ubicacion(webhookEvent ,locales)
                }
                else
                actions.sendTextMessage('No se encontraron resultados para este producto:'+namer, webhookEvent);
            })
        }
        var pasacel = parseInt(texto);
        if(!isNaN(pasacel) && isFinite(pasacel) || (evento != null && type == 3)){
            if(texto.length === 5 || evento.search){
                let count =0
                if(evento != null){
                texto = evento.search
                count = evento.skip
                }

               actions.getCoordinates(texto).then(response =>{
                   
                   if(response.results.length > 0){
                   let location = response.results[0].geometry.location
                   
                  sendAPI.getActivesOut(location.lat, location.lng, count).then(Locals =>{
                  if(Locals.length > 0){
                  let locales = actions.templatesLocales(Locals, 3, texto, count)                  
                  actions.ubicacion(webhookEvent ,locales)

                  if(Locals.length > 4)
                  actions.cargarMas(webhookEvent, 1)
                  }
                  else
                  actions.sendTextMessage('No tenemos lugares de comida en este CP, si lo deseas puedes buscar, por nombre del establecimiento o por platillo', webhookEvent);
                })
                   }
                   else{
                    actions.sendTextMessage('No tenemos lugares de comida en este CP, si lo deseas puedes buscar, por nombre del establecimiento o por platillo', webhookEvent);
                   }
               })     
            }
            else
            actions.sendTextMessage('Disculpa no entiendo', webhookEvent);

        }    
        else
        actions.sendTextMessage('Disculpa no entiendo ', webhookEvent);
    }
}


