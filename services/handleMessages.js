const actions = require('./actions');
const sendAPI = require('./graphAPI');

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
             console.log('postback, encuesta info inicio');
            handlePostback(webhookEvent);
        }
         
    
}


handlePostback = async (webhookEvent) => {
    let evento = webhookEvent.postback.payload;
    switch (evento) {
        case 'encuestas':
            //console.log('se eligio las encuestas ');
            actions.quickReplies(webhookEvent)
            break;


        case 'Informacion':
            handleLocation(webhookEvent);
           // actions.sendTextMessage('oprimiste mas info', webhookEvent);
            break;

        case 'inicio':
         
            sendAPI.getProfile(webhookEvent.sender.id).then( Profile =>{
            actions.sendTextMessage('Hola '+Profile.first_name+' Binevenid@ a ordenofacil, estoy para servirte aqui te dejo unas opciones', webhookEvent);
            });
            break;
        

    }
}

handlequickReplies = (webhookEvent) => {
    let reply = webhookEvent.message.quick_reply.payload;
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
    if (reply == 'servicio' || reply == 'rapidez' || reply == 'rapidez' || reply == 'ubicacion') {
        actions.quickReplies(webhookEvent, response);
    }
    else {
        actions.sendTextMessage('Gracias por ayudarnos a mejorar', webhookEvent);
    }

}



handleLocation = (webhookEvent) => {
    const replyLocation = {
        title: 'por favor compartenos tu codigo postal',
        content_type:'text',
        payload: 'CodigoPostal'

    }
    actions.quickReplies(webhookEvent, replyLocation);
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
        actions.sendTextMessage('NO te entiendo pero te puedo mandar mas info', webhookEvent);
    }
}


