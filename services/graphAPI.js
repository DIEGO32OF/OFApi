require('dotenv').config();
const request = require('request');


exports.callSendAPI = (requestBody) => {
    const url = 'https://graph.facebook.com/v3.3/me/messages';
    request({
        uri:url,
        qs: { access_token: process.env.ACCES_TOKEN },
        method: 'POST',
        json: requestBody,
    }, (error, Body) => {
        if (!error) {
           // console.log('peticion enviada', Body);
        }
        else {
           // console.log('no se pudo enviar la peticion', error);
        }
    }
    );
}

exports.getProfile=(senderID)=>{
    const url=`https://graph.facebook.com/v3.3/${senderID}`;
    request({
        uri:url,
             qs: { access_token: process.env.ACCES_TOKEN,
                 fields:'first_name,last_name,gender,locale,timezone'
                 },
                     method:'GET'
                         
    },(error,_res,body)=>{
        if(!error){
            let response=JSON.parse(body);
            console.log(response);
            console.log(`Nombre:${response.first_name} Apellido: ${response.last_name}`)
        }
    }
           );
}
