const actions = require('./actions');
const sendAPI = require('./graphAPI');
var SolicitudPrimera = require('../controllers/solicitud');

exports.handleMessage = async (webhookEvent) => {
     
       console.log(webhookEvent)
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
             console.log('postback, encuesta info inicio');
            handlePostback(webhookEvent);
        }
         
    
}


handlePostback = async (webhookEvent) => {
    let evento = webhookEvent.postback.payload;
    switch (evento) {
        case 'BuscPlaces':
            console.log('se eligio las encuestas ');
           // actions.quickReplies(webhookEvent)
           actions.OptionSearch(webhookEvent)
            break;


        case 'Informacion':
            handleLocation(webhookEvent);
           // actions.sendTextMessage('oprimiste mas info', webhookEvent);
            break;

        case 'inicio':
         
            sendAPI.getProfile(webhookEvent.sender.id).then( Profile =>{
                //guardar perfil en mongo
                //actions.sendTextMessage('Hola '+Profile.first_name+' Binevenid@ a ordenofacil, estoy para servirte aqui te dejo unas opciones ', webhookEvent);
                actions.optionInicio(webhookEvent, Profile)
           
            });
            break;
        

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
    actions.sendTextMessage('Que lugar estas buscando? contestame como en el siguiente ejemplo: "nombre:El Asado@ ', webhookEvent)
}
if(reply == 'namePlato' ){
    actions.sendTextMessage('Que se te antoja comer? contestame como en el siguiente ejemplo: "producto:Hamburguesas" ', webhookEvent)
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
    let nlp=webhookEvent.message.nlp;
    if(nlp.entities.mensaje)
    {
            if(nlp.entities.mensaje[0].value=='servicioDomicilio'){
                actions.sendTextMessage('si tenemos restaurantes asi', webhookEvent);
            }
    }
    else{
        let texto = webhookEvent.message.text
        if(texto.toLowerCase().includes('nombre')){
            let name = texto.split(':')
            sendAPI.getLocalesByNameProduct(1,name[1]).then( res =>{
                console.log(res,'---------------------------')
                let locales = actions.templatesLocales(Locals)                  
                  actions.ubicacion(webhookEvent ,locales)
            })
        }
        if(texto.toLowerCase().includes('producto')){
            let name = texto.split(':')
            sendAPI.getLocalesByNameProduct(2,name[1]).then( res =>{
                console.log(res,']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]')
                let locales = actions.templatesLocales(Locals)                  
                  actions.ubicacion(webhookEvent ,locales)
            })
        }
        var pasacel = parseInt(texto);
        if(!isNaN(pasacel) && isFinite(pasacel)){
            if(texto.length === 5){
               actions.getCoordinates(texto).then(response =>{
                   
                   if(response.results.length > 0){
                   let location = response.results[0].geometry.location
                  sendAPI.getActivesOut(location.lat, location.lng).then(Locals =>{
                  if(Locals.length > 0){
                  let locales = actions.templatesLocales(Locals)                  
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


