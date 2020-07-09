require('dotenv').config();
const request = require('request');
const axios = require('axios')
var solicitudfood = require('../models/solicitudFood');
var Menudo = require('../models/Menu');
const haversine = require('haversine')


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
                 fields:'first_name,last_name,gender,locale,timezone,email,address'
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

exports.getActivesOut = (lat, lng) => {
    console.log('entraaaaa')
    return new Promise((resolve, reject) => {
    solicitudfood.find({}).exec((err, Searching) => {
             
                if (Searching) {
                    const start = {
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lng)
                      }                      
                      let Locals =[]
                      Searching.forEach(coors => {                        
                        const end = {
                          latitude: parseFloat(coors.lat),
                          longitude: parseFloat(coors.lng)
                        }  
                          
                        if(haversine(start, end, {unit: 'meter'}) <= 8000){                            
                            Locals.push(coors)
                        }
                    }) 
                    resolve(Locals )
                }
                else {
                    resolve(null)
                }
            
    });
})
}

exports.getLocalesByNameProduct = (prefix, tipo) =>{
    return new Promise((resolve, reject) => {
    if (tipo == 1) {
      
        var getSearch = solicitudfood.find({ Nombre: new RegExp(prefix, 'i') }).sort({ 'Nombre': 1 }).limit(10);
        getSearch.populate({ path: 'id_Imgs', model: 'image' }).exec((err, buscados) => {
            if (err)
            resolve(null)
                //res.status(500).send({ message: 'Error en Peticion de los seis' + err });
            else {
                if (buscados) {
                    console.log(buscados);
                    resolve(buscados)
                }
                else {
                    resolve(null)
                }
            }
        });

    }
    else {
        //nombre comida
        var myLocal = Menudo.find({ is_Active: 1, menu: { $elemMatch: { Nombre: new RegExp(prefix, 'i') } } }).exec((err, Searching) => {
            //myLocal.populate({ path: 'id_Menu' }).populate({ path: 'id_Imgs', model: 'image' }).exec((err, Searching) => {
             //myLocal.populate({ path: 'id_Menu', model: 'menu', $match: { 'menu.Nombre': new RegExp(prefix, 'i') } }).populate({ path: 'id_Imgs', model: 'image' }).exec((err, Searching) => {

            if (err) {
                console.log(err);
                resolve(null)
                //res.status(500).send({ message: 'Error en Peticion de los ' + err });
            }
            else {
                if (Searching) {
                    var myarreglo = new Array();
                    Searching.forEach(function (encontrados) {

                        myarreglo.push(encontrados.id_Local);
                        //res.status(200).send({ Searching });
                    });
                    
                    var locales = solicitudfood.find({ id_SQL: { $in: myarreglo } });//, (err, buscados) => {
                    locales.populate({ path: 'id_Imgs', model: 'image' }).exec((err, buscados) => {
                        
                        if (err) {
                            console.log(err);
                            resolve(null)
                            //res.status(200).send({ message: 'Error en Peticion de los ' + err });
                        }
                        else {
                            if (buscados) {
                                resolve(buscados)
                               // res.status(200).send({ buscados });
                            }
                        }
                    });
                }
                else {
                    //res.status(200).send({});
                    resolve(null)
                }
            }
        });
    }
})
}
