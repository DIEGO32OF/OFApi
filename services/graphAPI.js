require('dotenv').config();
const request = require('request');

let tokenAcces = 'EAAJqBwwGCjQBABt4xFJNEZAJooZCEPNN1jtBQKsu3mY5QgKb9ps7HlbsySYFPrdP6vsBz4eOhKABvOLrgZBsjzUTG2LaCTGEW2D2wd5EkMENzZAYDF7rlmljETQF3EuSZB7hwhsiDS9zwOOkmZBZBLo9OEsfWgY8uGa1zl4e8xpu9xDC8wo1QDE'
exports.callSendAPI = (requestBody) => {
    const url = 'https://graph.facebook.com/v3.3/me/messages';
    console.log(tokenAcces)
    request({
        uri:url,
        qs: { access_token: tokenAcces},// process.env.ACCES_TOKEN },
        method: 'POST',
        json: requestBody,
    }, (error, Body) => {
        if (!error) {
            console.log('peticion enviada', Body);
        }
        else {
            console.log('no se pudo enviar la peticion', error);
        }
    }
    );
}

exports.getProfile=(senderID)=>{
    const url=`https://graph.facebook.com/v3.3/${senderID}`;
    console.log(tokenAcces)
    request({
        uri:url,
             qs: { access_token: : tokenAcces, //process.env.ACCES_TOKEN,
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
