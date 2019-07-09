const sendAPI = require('./graphAPI');



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
