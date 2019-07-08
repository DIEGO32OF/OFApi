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
