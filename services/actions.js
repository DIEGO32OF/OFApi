const sendAPI = require('./graphAPI');


const optionsBusqueda = {
    texto: 'como quieres realizar la busqueda, o si lo prefieres mas rapido y facil en https://comandaof.web.app podras encontrar mas opciones',
    replies: [
        {
            content_type: 'text',
            title: 'por nombre del lugar',
            payload:'namePlaces'
        },{
            content_type: 'text',
            title: 'cerca de mi',
            payload:'nearMe'
        },{
            content_type: 'text',
            title: 'por platillo',
            payload:'namePlato'
        }
    ]
}

exports.OptionSearch = (webhookEvent) => {
    // if (!replies) {
       let  replies = optionsBusqueda;
     //}
     let response = {
         recipient :{
             id: webhookEvent.sender.id
         },
         message: {
             text: replies.texto,
             quick_replies: replies.replies
         }
     }
     sendAPI.callSendAPI(response);
 }

const optionsInit = {
    texto: 'Hola _| Binevenid@ a ordenofacil, estoy para servirte aqui te dejo unas opciones ',
    replies: [
        {
            content_type: 'text',
            title: 'Buscar Lugares',
            payload:'BuscPlaces'
        },{
            content_type: 'text',
            title: 'Quiero mi bot',
            payload:'iWantBot'
        },{
            content_type: 'text',
            title: 'mas info de OF',
            payload:'infoOf'
        },{
            content_type: 'text',
            title: 'Contactar Asesor',
            payload:'contactAsesor'
        }
    ]
}




exports.optionInicio = (webhookEvent,  profile) => {
   // if (!replies) {
      let  replies = optionsInit;
    //}
    let response = {
        recipient :{
            id: webhookEvent.sender.id
        },
        message: {
            text: replies.texto.replace('_|', profile.first_name),
            quick_replies: replies.replies
        }
    }
    sendAPI.callSendAPI(response);
}

const repliesSurvey = {
    texto: 'por favor contesta la siguiente encuesta y dime que es lo que mas te gusto de nuestro servicio',
    replies: [
        {
            content_type: 'text',
            title: 'Servicios',
            payload:'servicio'
        },
        {
            content_type: 'text',
            title: 'Rapidez',
            payload: 'rapidez'
        },
        {
            content_type: 'text',
            title: 'ubicacion',
            payload: 'ubicacion'
        },
    ]
}

exports.quickReplies = (webhookEvent, replies) => {
    if (!replies) {
        replies = repliesSurvey;
    }
    let response = {
        recipient :{
            id: webhookEvent.sender.id
        },
        message: {
            text: replies.texto,
            quick_replies: replies.replies
        }
    }
    sendAPI.callSendAPI(response);
}

exports.sendTextMessage = (texto, webhookEvent) => {
    let response = {
        recipient:{
            id: webhookEvent.sender.id
        },
        message: {
            text:texto
        }
    }
    sendAPI.getProfile(webhookEvent.sender.id);
    sendAPI.callSendAPI(response);
}

exports.ubicacion = (webhookEvent) => {
    let response = {
        recipient:{
            id: webhookEvent.sender.id
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [{
                        title: 'tacos jarochos',
                        image_url: 'http://ordenofacil.com/logos/coca.jpg',
                        subtitle: 'direccion corta de los tacos',
                        default_action: {
                            type: 'web_url',
                            url:'https://www.google.com.mx/maps/@19.6337609,-99.1345474,15z',
                            messenger_extensions: 'FALSE',
                            webview_height_ratio:'COMPACT'
                        },
                        buttons: [{
                            type: 'web_url',
                            url: 'https://www.google.com.mx/maps/@19.6337609,-99.1345474,15z',
                            title:'mostrar el mapa'
                        },
                            {
                                type: 'phone_number',
                                title: 'llamar a la tienda',
                                payload:'+525531077600'
                            }

                        ]
                    }
                    ]
                }
            }
        }
    }
    sendAPI.callSendAPI(response);
}
