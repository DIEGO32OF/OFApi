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
                            type: 'https://www.google.com.mx/maps/@19.6308773,-99.1367803,3a,75y,195.59h,90t/data=!3m5!1e1!3m3!1sViqkrI4BQ4zQ1iCz2VZeHA!2e0!6s%2F%2Fgeo3.ggpht.com%2Fcbk%3Fpanoid%3DViqkrI4BQ4zQ1iCz2VZeHA%26output%3Dthumbnail%26cb_client%3Dsearch.TACTILE.gps%26thumb%3D2%26w%3D96%26h%3D64%26yaw%3D195.59064%26pitch%3D0%26thumbfov%3D100',
                            messenger_extension: 'FALSE',
                            webview_height_ratio:'COMPACT'
                        },
                        buttons: [{
                            type: 'web_url',
                            url: 'https://www.google.com.mx/maps/@19.6308773,-99.1367803,3a,75y,195.59h,90t/data=!3m5!1e1!3m3!1sViqkrI4BQ4zQ1iCz2VZeHA!2e0!6s%2F%2Fgeo3.ggpht.com%2Fcbk%3Fpanoid%3DViqkrI4BQ4zQ1iCz2VZeHA%26output%3Dthumbnail%26cb_client%3Dsearch.TACTILE.gps%26thumb%3D2%26w%3D96%26h%3D64%26yaw%3D195.59064%26pitch%3D0%26thumbfov%3D100',
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
