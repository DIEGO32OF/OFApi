const actions = require('./actions');

exports.handleMessage = (webhookEvent) => {
    if (webhookEvent.message) {
        let mensaje = webhookEvent.message;
        if (mensaje.quick_reply) {
            console.log('envio respuesta rapida como un clic boton');
            handlequickReplies(webhookEvent);
        }
        else if (mensaje.attachments) {
            console.log('se envio un adjunto');
        }
        else if (mensaje.text) {
            actions.sendTextMessage('has enviado texto', webhookEvent);
        }
         
    }
    else if (webhookEvent.postback) {
             console.log('pasa x aqui');
            handlePostback(webhookEvent);
        }
}

handlePostback = (webhookEvent) => {
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
            actions.sendTextMessage('Hola Binevenido a ordenofacil, yo te ayudo', webhookEvent);
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
        texto: 'por favor compartenos tu ubicacion',
        replies: [{
            content_type:'location'
        }]
    }
    actions.quickReplies(webhookEvent, replyLocation);
}

exports.ubicacion = (webhookEvent) => {
    let response = {
        recipient={
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
