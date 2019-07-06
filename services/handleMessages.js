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
    }
}