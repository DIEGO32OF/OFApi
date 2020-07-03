require('dotenv').config();
const request = require('request');
const axios = require('axios')


exports.callSendAPI = (requestBody) => {
    const url = 'https://graph.facebook.com/v3.3/me/messages';
    let tokenAcces = 'EAAJqBwwGCjQBABt4xFJNEZAJooZCEPNN1jtBQKsu3mY5QgKb9ps7HlbsySYFPrdP6vsBz4eOhKABvOLrgZBsjzUTG2LaCTGEW2D2wd5EkMENzZAYDF7rlmljETQF3EuSZB7hwhsiDS9zwOOkmZBZBLo9OEsfWgY8uGa1zl4e8xpu9xDC8wo1QDE'
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

exports.getProfile = async (senderID) =>{
return new Promise((resolve, reject) => {


    const url=`https://graph.facebook.com/v3.3/${senderID}`;
    let tokenAcces = 'EAAJqBwwGCjQBABt4xFJNEZAJooZCEPNN1jtBQKsu3mY5QgKb9ps7HlbsySYFPrdP6vsBz4eOhKABvOLrgZBsjzUTG2LaCTGEW2D2wd5EkMENzZAYDF7rlmljETQF3EuSZB7hwhsiDS9zwOOkmZBZBLo9OEsfWgY8uGa1zl4e8xpu9xDC8wo1QDE'

   /*  const qs = {
        
            "access_token": tokenAcces,
            "fields":'first_name,last_name,gender,locale,timezone'            
        
    
    };
    axios.get(url, qs).then( res => {
        console.log(res.data,'///////////]]]]]]]]]]]]')
        return res.data
    }).catch(error=>{
        console.log(error)
    }); */

     
     
    request({
        uri:url,
             qs: { access_token:  tokenAcces, //process.env.ACCES_TOKEN,
                 fields:'first_name,last_name,gender,locale,timezone,email'
                 },
                     method:'GET'
                         
    },(error,_res,body)=>{
        if(!error){
            let response=JSON.parse(body);
            console.log(response); 
            resolve(response)           
           // return response
        }
    }
           );
        })
}
