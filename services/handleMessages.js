const actions = require('./actions');
const sendAPI = require('./graphAPI');
var solicitud = require('../controllers/solicitud');

exports.handleMessage = async (webhookEvent) => {
     
       console.log(webhookEvent)
    if (webhookEvent.message) {
        let mensaje = webhookEvent.message;
        if (mensaje.quick_reply) {
        //console.log('envio respuesta rapida como un clic boton');
            handlequickReplies(webhookEvent);
        }
        else if (mensaje.attachments) {
            //console.log('se envio un adjunto');
            actions.ubicacion(webhookEvent);
        }
        else if (mensaje.text) {
           // actions.sendTextMessage('has enviado texto', webhookEvent);
            handleNlp(webhookEvent);
        }
         
    }
    else if (webhookEvent.postback) {
             console.log('postback, encuesta info inicio');
            handlePostback(webhookEvent);
        }
         
    
}


handlePostback = async (webhookEvent) => {
    let evento = webhookEvent.postback.payload;
    switch (evento) {
        case 'BuscPlaces':
            console.log('se eligio las encuestas ');
           // actions.quickReplies(webhookEvent)
           actions.OptionSearch(webhookEvent)
            break;


        case 'Informacion':
            handleLocation(webhookEvent);
           // actions.sendTextMessage('oprimiste mas info', webhookEvent);
            break;

        case 'inicio':
         
            sendAPI.getProfile(webhookEvent.sender.id).then( Profile =>{
                //guardar perfil en mongo
                //actions.sendTextMessage('Hola '+Profile.first_name+' Binevenid@ a ordenofacil, estoy para servirte aqui te dejo unas opciones ', webhookEvent);
                actions.optionInicio(webhookEvent, Profile)
           
            });
            break;
        

    }
}

handlequickReplies = (webhookEvent) => {
    let reply = webhookEvent.message.quick_reply.payload;
    if (reply == 'servicio' || reply == 'rapidez'  || reply == 'ubicacion') {
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
    
        actions.quickReplies(webhookEvent, response);
    }
    if (reply == 'sirecomiendo' || reply == 'Norecomiendo') {
        actions.sendTextMessage('Gracias por ayudarnos a mejorar', webhookEvent);
    }
    if (reply == 'BuscPlaces' ){
        actions.OptionSearch(webhookEvent)

    }
    if(reply == 'nearMe' ){
        actions.sendTextMessage('por favor comparteme tu codigo postal', webhookEvent)
}
    

}



handleLocation = (webhookEvent) => {
  /*   const replyLocation = {
        title: 'por favor compartenos tu codigo postal',
        content_type:'text',
        payload: 'CodigoPostal'

    }
    actions.quickReplies(webhookEvent, replyLocation); */
    //actions.sendTextMessage('por favor comparteme tu codigo postal')
    // hayq ue agarrar un local y mostrarlo en las cards
}

handleNlp=(webhookEvent)=>{
    let nlp=webhookEvent.message.nlp;
    if(nlp.entities.mensaje)
    {
            if(nlp.entities.mensaje[0].value=='servicioDomicilio'){
                actions.sendTextMessage('si tenemos restaurantes asi', webhookEvent);
            }
    }
    else{
        let texto = webhookEvent.message.text
        var pasacel = parseInt(texto);
        if(!isNaN(pasacel) && isFinite(pasacel)){
            if(texto.length === 5){
               actions.getCoordinates(texto).then(response =>{
                   let location = response.results[0].geometry.location
                  let Locals = solicitud.getActivesOut(location.lat, location.lng)
                  console.log(Locals)
                  let locales = []
                  for(const local of locals){
                      locales.push({title: local.Nombre, 
                        image_url: 'http://ordenofacil.com/Logos/slide1.jpg',
                        subtitle: local.Domicilio,
                        default_action: {
                            type: 'web_url',
                            url:'https://www.google.com.mx/maps/@'+local.lat+','+local.lng,
                            messenger_extensions: 'FALSE',
                            webview_height_ratio:'COMPACT'
                        },
                        buttons: [{
                            type: 'web_url',
                            url: 'https://www.google.com.mx/maps/@'+local.lat+','+local.lng,
                            title:'mostrar el mapa'
                        },
                            {
                                type: 'web_url',
                                title: 'ver menu',
                                payload:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed
                            },
                            {
                                type: 'text',
                                title: 'Domicilio',
                                payload:local.nom_img
                            }

                        ]
                    })
                  }
                  /*  title: 'tacos jarochos',
                        image_url: 'http://ordenofacil.com/logos/coca.jpg',
                        subtitle: 'direccion corta de los tacos',
                        default_action: {
                            type: 'web_url',
                            url:'https://www.google.com.mx/maps/@19.6337609,-99.1345474,15z',
                            messenger_extensions: 'FALSE',
                            webview_height_ratio:'COMPACT'
                        },
                        buttons: [{
                            type: 'web_url',
                            url: 'https://www.google.com.mx/maps/@19.6337609,-99.1345474,15z',
                            title:'mostrar el mapa'
                        },
                            {
                                type: 'phone_number',
                                title: 'llamar a la tienda',
                                payload:'+525531077600'
                            }

                        ]*/ 
               })     
            }
            else
            actions.sendTextMessage('Disculpa no entiendo', webhookEvent);

        }
        else
        actions.sendTextMessage('Disculpa no entiendo ', webhookEvent);
    }
}


