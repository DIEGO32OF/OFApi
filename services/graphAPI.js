require('dotenv').config();
const request = require('request');


exports.callSendAPI = (requestBody) => {
    const url = 'https://graph.facebook.com/v3.3/me/messages';
    request({
        uri:url,
        qs: { acces_token: process.env.ACCES_TOKEN, },
        method: 'POST',
        json: requestBody,
    }, (error, Body) => {
        if (!error) {
            console.log('peticion enviada', Body);
        }
        else {
            console.log('no se pudo enviar la peticion', error);
        }
    );
}
