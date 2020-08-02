const sendAPI = require('./graphAPI');
const request = require('request');



exports.demoBot = (local) => {
    
        let replies = []
        console.log(local)
        
        let locales =[]

        
        if(local.servDom == 1){
        replies.push({ 
        type: 'web_url',
        title: 'Servicio a Domicilio',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed+'#servdom'
        
    })
    
    
}
if(local.makeReserve == '1'){
    replies.push({ 
        type: 'web_url',
        title: 'Hacer reservacion',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed+'#makereserve'
    })
    
}

/* if(local.EncuestaServ == '1'){
    replies.push({ 
        content_type: 'text',
        title: 'Resolver Encuesta',
        payload:'makeReserve1234'
    })         
     
}*/

/* if(local.lealServ == '1'){
    replies.push({ 
        type: 'web_url',
        title: 'Programa Lealtad',
        payload:'lealServ1234'
    })
    
} */

replies.push({ 
    type: 'web_url',
    title: 'Buscar Productos',
    url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed+'#searchprod'
})

if(replies.length == 3){
    locales.push({title: 'Mas Opciones',     
    subtitle: 'Gracias por tu preferencia',
    default_action: {
        type: 'web_url',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed,
        messenger_extensions: 'FALSE',
        webview_height_ratio:'COMPACT'
    },
    buttons: replies 
    

})
replies = []
}


replies.push({ 
    type: 'web_url',
    title: 'Calificanos',
    url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed+'#aproveus'
})

if(replies.length == 3){
    locales.push({title: 'Mas Opciones',     
    subtitle: 'Gracias por tu preferencia',
    default_action: {
        type: 'web_url',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed,
        messenger_extensions: 'FALSE',
        webview_height_ratio:'COMPACT'
    },
    buttons: replies 
    

})
replies = []
}

if(local.id_EvenPromo.length > 0 || local.id_PaqEspe.length > 0){
replies.push({ 
    type: 'web_url',
    title: 'Promociones',
    url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed+'#portfolio'
})
}
if(replies.length == 3){
    locales.push({title: 'Mas Opciones',     
    subtitle: 'Gracias por tu preferencia',
    default_action: {
        type: 'web_url',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed,
        messenger_extensions: 'FALSE',
        webview_height_ratio:'COMPACT'
    },
    buttons: replies 
    

})
replies = []
}
replies.push({ 
    type: 'postback',
    title: 'Escribenos',
    payload: '123456Escribenos'
})
if(replies.length == 3){
    locales.push({title: 'Mas Opciones',     
    subtitle: 'Gracias por tu preferencia',
    default_action: {
        type: 'web_url',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed,
        messenger_extensions: 'FALSE',
        webview_height_ratio:'COMPACT'
    },
    buttons: replies 
    

})
replies = []
}
replies.push({ 
    type: 'phone_number',
    title: 'llamanos',
    payload: '5531077600'
})



locales.push({title: 'Mas Opciones',     
    subtitle: 'Gracias por tu preferencia',
    default_action: {
        type: 'web_url',
        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed,
        messenger_extensions: 'FALSE',
        webview_height_ratio:'COMPACT'
    },
    buttons: replies 
    

})
console.log(locales)
return locales

 }

const chargeMore = {
    texto: 'Cargar mas resultados',
    replies: [
        {
            content_type: 'text',
            title: 'cargar mas resultados',
            payload:'chargeMore_|'
        }
    ]    
}

exports.cargarMas = (webhookEvent, numeric) => {
    // if (!replies) {
        let replican = chargeMore.replies.payload.replace('|',numeric)
        chargeMore.replies.payload = replican
       let  replies = chargeMore;
     //}
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


 const prodFreeInfo = {
    texto: 'Nuestros productos se dividen en 2, gratuitos y de paga; \n - gratuitos: \n - pagina y app movil: En tu pagina puedes cargar hasta 15 platillos con imagen, descripcion y precios \n - subir eventos, promociones especiales y/o paquetes\n - subir info de tu negocio (ubicacion, horarios, telefonos, redes sociales...). \n - Acceso a tablero de control. \n - Si lo deseas puedes recibir comandas desde la pagina y darles seguimiento desde tu tablero. \n este es un ejemplo:\n https://comandaof.web.app/menu/dnE6XnhrjrU_/U--8XWEEwSQ_  \n Nota* al contratar cualquier producto accedes a la version full de OrdenoFacil y desaparecen las restricciones ' ,
    replies: [
       {
           content_type: 'text',
           title: 'productos con costo',
           payload:'showProdCosto'
       }
   ]
}

exports.prodInfoFree = (webhookEvent) => {
    // if (!replies) {
       let  replies = prodFreeInfo;
     //}
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

 const moreInfoOF = {
     texto: 'OrdenoFacil te brinda la posibilidad de crear tu menu digital, y acceder a el desde un codigo QR; Tus clientes pueden: \n - Levantar ordenes desde tu pagina \n - Hacer pedidos a domicilio \n - Hacer reservaciones \n - responder encuestas \n - Imagina enviar notificaciones push o email a tus clientes promocionando algun evento o platillo \n - O recibir ordenes o comandas desde facebook. \nSe ajusta a cualquier tipo de negocio.  Puedes registrarte gratis en \n ordenofacil.com/Registro.aspx \n o visita: \n ordenofacil.com \n para mayor informacion' ,
     replies: [
        {
            content_type: 'text',
            title: 'productos OrdenoFacil',
            payload:'prodOF'
        },{
            content_type: 'text',
            title: 'precios OrdenoFacil',
            payload:'priceOF'
        },{
            content_type: 'text',
            title: 'Contactar Asesor',
            payload:'contactAsesor'
        }
    ]
 }

 exports.InfoOF = (webhookEvent) => {
    // if (!replies) {
       let  replies = moreInfoOF;
     //}
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




const optionsBusqueda = {
    texto: 'como quieres realizar la busqueda? o si lo prefieres mas facil y rapido en https://comandaof.web.app podras encontrar mas opciones',
    replies: [
        {
            content_type: 'text',
            title: 'por nombre del lugar',
            payload:'namePlaces'
        },{
            content_type: 'text',
            title: 'cerca de mi',
            payload:'nearMe'
        },{
            content_type: 'text',
            title: 'por platillo',
            payload:'namePlato'
        }
    ]
}

exports.OptionSearch = (webhookEvent) => {
    // if (!replies) {
       let  replies = optionsBusqueda;
     //}
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

const optionsInit = {
    texto: 'Hola _| Bienvenid@ a ordenofacil, estoy para servirte aqui te dejo unas opciones ',
    replies: [
        {
            content_type: 'text',
            title: 'Buscar Lugares',
            payload:'BuscPlaces'
        },{
            content_type: 'text',
            title: 'Info de OrdenoFacil',
            payload:'infoOf'
        },{
            content_type: 'text',
            title: 'Quiero mi Bot',
            payload:'iwantBot'
        },{
            content_type: 'text',
            title: 'Contactar Asesor',
            payload:'contactAsesor'
        }
    ]
}




exports.optionInicio = (webhookEvent,  profile) => {
   // if (!replies) {
      let  replies = optionsInit;
    //}
    let response = {
        recipient :{
            id: webhookEvent.sender.id
        },
        message: {
            text: replies.texto.replace('_|', profile.first_name),
            quick_replies: replies.replies
        }
    }
    sendAPI.callSendAPI(response);
}

const repliesSurvey = {
    texto: 'por favor responde la siguiente encuesta y dime que es lo que mas te gusto de nuestro servicio',
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
    //sendAPI.getProfile(webhookEvent.sender.id);
    sendAPI.callSendAPI(response);
}

exports.getCoordinates =(address) =>{
    return new Promise((resolve, reject) => {
        request({
            uri:"https://maps.googleapis.com/maps/api/geocode/json?address="+address+'&key=AIzaSyAkSWwG52ys2U7DtutEdywPTEbv_Igsdco',
            method:'GET'
        },(error,_res,body)=>{
            if(!error){
                let response=JSON.parse(body);                
                resolve(response)           
               // return response
            }
        }
               );
            })
  }

exports.ubicacion = (webhookEvent, locales) => {
    let response = {
        recipient:{
            id: webhookEvent.sender.id
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: locales//[{
                      /*   title: 'tacos jarochos',
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

                        ] */
                    //}]
                }
            }
        }
    }
    sendAPI.callSendAPI(response);
}

exports.templatesLocales = (Locals, type, searchBy, skip, isOptions) =>{
    let locales = []
    let counter = 0
    let count = 0
    console.log(Locals)
    for(const local of Locals){
        let tipo = ''
        let servDom = ''
        if(local.servDom == 1)
        servDom = '- Cuenta con Servicio a Domicilio'
        switch(local.tipo)
        {
            case 1:
                tipo = 'Antojitos / Tacos /Fonda'
                break;
                case 2:
                tipo = 'Bar/Antro'
                break;
                case 3:
                tipo = 'Comida Rapida'
                break;
                case 4:
                tipo = 'Cafeteria/Postres'
                break;
                case 5:
                tipo = 'Food Truck /Snack comercial'
                break;
                case 6:
                    tipo = 'Pizzeria'
                    break;
                    case 7:
                        tipo = 'Restaurante'
                        break;
        }
      if(counter < 5){
          
          let imagen = ''
          if(local.id_Imgs.length > 0){
            let obj = local.id_Imgs.filter(x=> x.tipo == 1)
            
            if(obj.length > 0)
            imagen = obj[0].Nombre

            if(imagen == '')
          imagen ='http://ordenofacil.com/Logos/slide1.jpg'
          }
          else{          
          imagen ='http://ordenofacil.com/Logos/slide1.jpg'
          }
          console.log(imagen)

          let botones = []

          if(counter === 4 && Locals.length > 5)
          {
            count = skip+1
            botones = [
                {
                    type: 'web_url',
                    title: 'ver menu',
                    url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed
                },
                {
                  type: 'web_url',
                  url: 'https://www.google.com.mx/maps/@'+local.lat+','+local.lng,
                  title:'mostrar en el mapa'
              },
              {
                type: 'postback',
                payload: JSON.stringify({'type':type,'search':searchBy,'skip':count}),
                title:'cargar mas resultados'
            }
  
            ]
          }
          else{
              if(isOptions){
                botones = [
                    {
                        type: 'web_url',
                        title: 'ver menu',
                        url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed
                    },
                    {
                      type: 'web_url',
                      url: 'https://www.google.com.mx/maps/@'+local.lat+','+local.lng,
                      title:'mostrar en el mapa'
                  },
                  {
                    type: 'postback',
                    payload: 'iwantOptions',
                    title:'Mas opciones'
                }
      
                ]
              }
              else{
            botones = [
                {
                    type: 'web_url',
                    title: 'ver menu',
                    url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed
                },
                {
                  type: 'web_url',
                  url: 'https://www.google.com.mx/maps/@'+local.lat+','+local.lng,
                  title:'mostrar en el mapa'
              }
  
            ]
        }
          }

        locales.push({title: local.Nombre, 
          image_url: imagen,
          subtitle: tipo+'\nHorarios:'+local.nom_img+ servDom,
          default_action: {
              type: 'web_url',
              url:'https://comandaof.web.app/menu/dnE6XnhrjrU_/'+local.id_Hashed,
              messenger_extensions: 'FALSE',
              webview_height_ratio:'COMPACT'
          },
          buttons: botones 
          

      })
  }
      counter++
    }
    return locales
}
