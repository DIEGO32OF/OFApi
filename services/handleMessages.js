const actions = require('./actions');

exports.handleMessage = (webhookEvent) => {
    if (webhookEvent.message) {
        let mensaje = webhookEvent.message;
        if (mensaje.quick_reply) {
            console.log('envio respuesta rapida como un clic boton');
        }
        else if (mensaje.attachments) {
            console.log('se envio un adjunto');
        }
        else if (mensaje.text) {
            actions.sendTextMessage('has enviado texto', webhookEvent);
        }
         else if (webhookEvent.postback) {
            handlePostback
        }
    }
}

handlePostback = (webhookEvent) => {
    let evento = webhookEvent.postback.payload;
    switch (evento) {
        case 'encuestas':
            console.log('se eligio las encuestas ');
            break;


        case 'Informacion':
            actions.sendTextMessage('oprimiste mas info', webhookEvent);
            break;

        case 'inicio':
            actions.sendTextMessage('Hola Binevenido a ordenofacil, yo te ayudo', webhookEvent);
            break;

    }
}
