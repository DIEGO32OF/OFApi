'use strict'

var solicitudfood = require('../models/solicitudFood');
var eventorpromo = require('../models/eventorpromo');
var paqespe = require('../models/paqespe');
var images = require('../models/img');
var Coders = require('../models/Codigo');
var comensal = require('../models/comensales');
var bcrypt = require('bcrypt-nodejs');
var Cookies = require('cookies');
var jwt = require('../services/jwt');
var onlysix = require('../models/onlysix');
var Menudo = require('../models/Menu');
var mongoose = require('mongoose');
var comentario = require('../models/Comentarios');
var comanda = require('../models/comandas');
var rank = require('../models/rank');
var visita=require('../models/Visitas');
var advertising = require('../models/advertising');
var reservation = require('../models/reservation');
const haversine = require('haversine')
require('dotenv').config();
const actions = require('../services/actions');
const handle = require('../services/handleMessages');

//var express = require('express')();
//var app = express;

function cambiaTipo(fechaResolve) {
    var fecha = fechaResolve.replace('|', '/').replace('|', '/').replace('-', ':').replace('_', ' ')
    return fecha;
}

function setReservasion(req, res){
  var parames = req.params;	
  var reservasion = new reservation();
  reservasion.mail = parames.mail;
  reservasion.Nombre = parames.nombre;
  reservasion.fechaReserv = cambiaTipo(parames.fechaReserv);
  reservasion.personas = parames.personas;
  reservasion.local = parames.local
  reservasion.telefono = parames.telefono;
  reservasion.fecha = cambiaTipo(parames.solicitado);
  reservasion.estatus = 1		
	reservasion.save((err, reservacionSave) => {
		if(!err){
			res.status(200).send({reservasion: reservacionSave})
		}
		else{
			res.status(500).send({message: 'error al guardar la reservasion'+ err})
		}					
	})	
}


function guardaComentarios(req,res)
{
    var parametros =req.body;    
    var myComent=new comentario();

    //var date=new Date();
  var fecha = cambiaTipo(parametros.fec);//formatoDate(date);

    myComent.mail=parametros.mail;
    myComent.Nombre=parametros.Name;
    myComent.local=parametros.Local;
    myComent.Fecha_Creada=fecha;//params.fecha;
    myComent.comentario=parametros.comenta;


    myComent.save((err,Comentguardado) =>{
      if(Comentguardado){
        res.status(200).send({ comentario:Comentguardado });
      }
      else{

        res.status(200).send({ comentario:null });
      }
    });
  }

function GuardaRank(req, res){
  var parames =req.body// req.params; esta es por get  
var myrank=new rank();
 var fecha=cambiaTipo(parames.fecha);//formatoDate(date);

 myrank.Idusuario=parames.usuario;
 myrank.Calificacion=parames.calif;
 myrank.Local=parames.Local;
 myrank.fecha=fecha;//params.fecha;
 //myrank.sendMail=false;
 myrank.save((err,rankGuarda) =>{
   if(!err){
     if(rankGuarda){
res.status(200).send({ rank:rankGuarda });
}
else {
  res.status(200).send({ rank:null });
}
}
else {
  res.status(200).send({ rank:null });
}
});
}


function GetBusca(req, res) {
    var parames = req.params;
    var tipo = parames.typer;
    var prefix = parames.Busqueda;
    if (tipo == 1) {
        //nombre lugar
        console.log(prefix);

        var getSearch = solicitudfood.find({ Nombre: new RegExp(prefix, 'i') }).sort({ 'Nombre': 1 }).limit(10);
        getSearch.populate({ path: 'id_Imgs', model: 'image' }).exec((err, buscados) => {
            if (err)
                res.status(500).send({ message: 'Error en Peticion de los seis' + err });
            else {
                if (buscados) {
                    console.log(buscados);
                    res.status(200).send({ buscados });
                }
                else {
                    console.log('no hay');
                }
            }
        });

    }
    else {
        //nombre comida
        var myLocal = Menudo.find({ is_Active: 1, menu: { $elemMatch: { Nombre: new RegExp(prefix, 'i') } } }).exec((err, Searching) => {
            //myLocal.populate({ path: 'id_Menu' }).populate({ path: 'id_Imgs', model: 'image' }).exec((err, Searching) => {
            // myLocal.populate({ path: 'id_Menu', model: 'menu', $match: { 'menu.Nombre': new RegExp(prefix, 'i') } }).populate({ path: 'id_Imgs', model: 'image' }).exec((err, Searching) => {

            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Error en Peticion de los ' + err });
            }
            else {
                if (Searching) {
                    var myarreglo = new Array();
                    Searching.forEach(function (encontrados) {

                        myarreglo.push(encontrados.id_Local);
                        //res.status(200).send({ Searching });
                    });
                    console.log(myarreglo[0]);
                    var locales = solicitudfood.find({ id_SQL: { $in: myarreglo } });//, (err, buscados) => {
                    locales.populate({ path: 'id_Imgs', model: 'image' }).exec((err, buscados) => {
                        console.log(buscados);
                        if (err) {
                            console.log(err);
                            res.status(200).send({ message: 'Error en Peticion de los ' + err });
                        }
                        else {
                            if (buscados) {
                                res.status(200).send({ buscados });
                            }
                        }
                    });
                }
                else {
                    res.status(200).send({});
                    console.log('no hay');
                }
            }
        });
    }
}


function getdashbord(req, res) {
    var parames = req.params;
    var dato = new Date();
    dato.setDate(dato.getDate() - 1);
    var locales = parames.Esta;
    var hoy = cambiaTipo(parames.Time);//formatoDate(dato).split(' ');

    var eldiadHoy = hoy;
   // console.log(eldiadHoy);
    var horasLocal = 0;
    var separados = eldiadHoy.split('/');

    solicitudfood.find({ id_Hashed: locales }).exec((err, Horario) => {
        if (Horario) {
            horasLocal = Horario[0].nom_img;
            var mihorarioSplit = horasLocal.split('-');
            var horafin = mihorarioSplit[1].split(':');
            var horaIni = mihorarioSplit[0].split(':');
            var tiempoAbierto = 0;
            if (parseInt(horafin[0]) < parseInt(horaIni[0])) {
                tiempoAbierto = ((24 - parseInt(horaIni[0])) + parseInt(horafin[0])) / 8;

            }
            else
                tiempoAbierto = (parseInt(horafin[0]) - parseInt(horaIni[0])) / 8;

            comanda.find({ local: locales, fecha_Entrega: new RegExp(eldiadHoy, 'i') }).sort({ 'fecha_Entrega': 1 })
                .exec((err, Comanda) => {


                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: 'Error en la pantalla de home ' + err });
                    }
                    else {

                        if (Comanda) {
                            visita.find({
                                $or: [{ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') },
                                { local: locales, Fecha_Creada: new RegExp(separados[2] + '/' + separados[1] + '/' + separados[0], 'i') }]
                            })
                                .sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasionEncontradas) => {
                                  // console.log(visitasionEncontradas);
                                    var counter = Comanda.length;
                                    var platillos = new Array();
                                    var Time_tarde_cancel = new Array();
                                    var lapso = 0;
                                    var lapsus = 0;
                                    for (var f = 0; f < 9; f++) {

                                        if (f == 0) {
                                            lapso = parseInt(horaIni[0]);
                                            Time_tarde_cancel.push({
                                                Canceladas: 0,
                                                Atiempo: 0,
                                                retrasadas: 0,
                                                comandas: 0,
                                                ingresos: 0,
                                                time: mihorarioSplit[0]
                                            });
                                        }
                                        else {
                                            lapso = lapso + tiempoAbierto;

                                            var HORAVa = (lapso).toString().split('.');

                                            var horasMin = 0;
                                            if ((lapso).toString().indexOf('.') > -1)
                                                horasMin = (lapso).toString().substring((lapso).toString().indexOf('.') + 1, (lapso).toString().indexOf('.') + 3);

                                            var hours = Math.floor(horasMin / 60);
                                            var minutes = horasMin % 60;
                                            //console.log(HORAVa[0]+"___"+hours+":"+minutes);
                                            if (minutes.toString().length == 1) {
                                                if (horasMin > 60)
                                                    minutes = "0" + minutes;
                                                else
                                                    minutes = minutes + "0";
                                            }


                                            lapsus = (parseInt(hours) + parseInt(HORAVa[0])) + ":" + minutes.toString();
                                            lapso = (parseFloat(parseInt(hours) + parseInt(HORAVa[0]) + "." + minutes.toString()));
                                            console.log(lapsus+'  '+lapso);
                                            Time_tarde_cancel.push({
                                                Canceladas: 0,
                                                Atiempo: 0,
                                                retrasadas: 0,
                                                comandas: 0,
                                                ingresos: 0,
                                                time: lapsus
                                            });
                                        }

                                    }
                                    //los Ingresos o visitas
                                    console.log(visitasionEncontradas);
                                    for (var v = 0; v < visitasionEncontradas.length; v++) {
                                        var horaVisita = visitasionEncontradas[v].Fecha_Creada.split(' ');
                                        var horaVisit = horaVisita[1].replace(':', '');
                                        for (var p = 0; p < 9; p++) {
                                            var incre = p + 1;
                                            if (p + 1 >= 9)
                                                incre = 8;
                                            if (horaVisit > parseInt(Time_tarde_cancel[p].time.replace(':', '')) && horaVisit <= parseInt(Time_tarde_cancel[incre].time.replace(':', ''))) {
                                                
                                                Time_tarde_cancel[incre].ingresos = Time_tarde_cancel[incre].ingresos + 1;
                                            }
                                            //if (incre == 8) {
                                            //    if (horaVisit >= parseInt(Time_tarde_cancel[p].time.replace(':', '')))
                                            //        Time_tarde_cancel[p].ingresos = Time_tarde_cancel[p].ingresos + 1;
                                            //}
                                        }
                                    }

                                    for (var t = 0; t < Comanda.length; t++) {
                                        var fechaEntregada = Comanda[t].fecha_Entrega;
                                        var fechacortada = fechaEntregada.split(' ');
                                        var horaCoamnda = fechacortada[1].replace(':', '');
                                        for (var p = 0; p < 9; p++) {
                                            var incre = p + 1;
                                            if (p + 1 >= 9)
                                                incre = 8;

                                            if (horaCoamnda > parseInt(Time_tarde_cancel[p].time.replace(':', '')) && horaCoamnda <= parseInt(Time_tarde_cancel[incre].time.replace(':', ''))) {
                                                Time_tarde_cancel[incre].comandas = Time_tarde_cancel[incre].comandas + 1;
                                                
                                            }
                                        }


                                        for (var g = 0; g < Comanda[t].platillos.length; g++) {
						var cantidades = Comanda[t].platillos[g].Cantidad;
                                            if (Comanda[t].platillos[g].Estatus == "2") {
                                               
                                                 var platilloCheca = Comanda[t].platillos[g].Platillo;
                                                
console.log(Comanda[t].platillos[g].fechaCreado,'//////////////////////')
                                                var yatarde = Comanda[t].platillos[g].fechaCreado.split(' ');
                                                var hora = yatarde[1].replace(':', '');
							console.log(fechaEntregada,'----------------')
                                                var horacomand = fechaEntregada.split(' ');
                                                var horahoy = horacomand[1].replace(':', '');

                                                for (var p = 0; p < 9; p++) {
                                                    var incre = p + 1;
                                                    if (p + 1 >= 9)
                                                        incre = 8;

                                                   if (hora > parseInt(Time_tarde_cancel[p].time.replace(':', '')) && hora <= parseInt(Time_tarde_cancel[incre].time.replace(':', ''))) {
                                                        //console.log();
                                                        if (horahoy - hora >= 30) {
                                                            //va tarde
                                                            if (parseInt(cantidades) == 1)
                                                                Time_tarde_cancel[incre].retrasadas = Time_tarde_cancel[incre].retrasadas + 1;
                                                            else
                                                                Time_tarde_cancel[incre].retrasadas = Time_tarde_cancel[incre].retrasadas + parseInt(cantidades);

                                                        }
                                                        else {
                                                            if (parseInt(cantidades) == 1)
                                                                Time_tarde_cancel[incre].Atiempo = Time_tarde_cancel[incre].Atiempo + 1;
                                                            else
                                                                Time_tarde_cancel[incre].Atiempo = Time_tarde_cancel[incre].Atiempo + parseInt(cantidades);
                                                        }
                                                        
                                                    }
                                                }
                                                if (t == 0 && g == 0) {
                                                    platillos.push({
                                                        value: cantidades,
                                                        name: platilloCheca,

                                                    })

                                                }
                                                else {
                                                    var lotienen = false;
                                                    var index = 0;
                                                    var micantidad = 0;
                                                    for (var i = 0; i < platillos.length; i++) {
                                                        //console.log(platillos.length+'-'+i+'-'+platillos[i].name+'-'+platilloCheca)
                                                        if (platillos[i].name != undefined && lotienen == false) {
                                                            if (platillos[i].name.trim() == platilloCheca.trim()) {
                                                                lotienen = true;
                                                                index = i;
                                                                micantidad = platillos[i].value;
                                                                i = platillos.length;
                                                            }
                                                        }

                                                    }
                                                    if (lotienen) {
                                                        //platillos.splice(index,1,"{Plato:"+platilloCheca+", Cantidad:"+(cantidades+micantidad)+"}")
                                                        platillos[index].value = cantidades + micantidad;
                                                        //console.log(platillos[index].value);
                                                    }
                                                    else {
                                                        platillos.push({
                                                            value: cantidades,
                                                            name: platilloCheca,
                                                        });
                                                    }
                                                }
                                            }
                                            else {
                                                // canceladas
                                                for (var p = 0; p < 9; p++) {
                                                    var incre = p + 1;
                                                    if (p + 1 >= 9)
                                                        incre = 8;

                                                    if (hora > parseInt(Time_tarde_cancel[p].time.replace(':', '')) && hora <= parseInt(Time_tarde_cancel[incre].time.replace(':', ''))) {
							    if(parseInt(cantidades)==1)
                                                        Time_tarde_cancel[incre].Canceladas = Time_tarde_cancel[incre].Canceladas + 1;
							    else
							 Time_tarde_cancel[incre].Canceladas = Time_tarde_cancel[incre].Canceladas + parseInt(cantidades);
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    //console.log(Time_tarde_cancel);
                                    rank.find({ Local: locales, fecha: new RegExp(eldiadHoy, 'i') }).exec((err, rankeo) => {

                                        if (rankeo) {
                                            comentario.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, comentariodesc) => {


                                                if (comentariodesc) {
                                                    //visita.find({local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i')  }).sort({ 'Fecha_Creada': 1 }).exec((errvisit, visitasEncontradas) => {
                                                    //console.log(visitasEncontradas);
                                                    //if(visitasEncontradas)
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: rankeo, comentarios: comentariodesc, visitasion: visitasionEncontradas });
                                                    //else
                                                    //res.status(200).send({ comander:Comanda, cuantos:counter,topten:platillos,tiempos: Time_tarde_cancel, rankin:rankeo, comentarios:comentariodesc, visitasion:''});
                                                    //});

                                                }
                                                else {
                                                    //visita.find({local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i')  }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                    //if(visitasEncontradas)
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: rankeo, comentarios: '', visitasion: visitasionEncontradas });
                                                    //else
                                                    //res.status(200).send({ comander:Comanda, cuantos:counter,topten:platillos,tiempos: Time_tarde_cancel, rankin:rankeo, comentarios:'', visitasion:''});
                                                    //});
                                                }



                                            });
                                        }
                                        else {
                                            comentario.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, comentariodesc) => {

                                                if (comentariodesc) {
                                                    visita.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                        if (visitasEncontradas)
                                                            res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: comentariodesc, visitasion: visitasEncontradas });
                                                        else
                                                            res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: comentariodesc, visitasion: '' });
                                                    });

                                                }
                                                else {
                                                    visita.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                        if (visitasEncontradas)
                                                            res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: '', visitasion: visitasEncontradas });
                                                        else
                                                            res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: '', visitasion: '' });
                                                    });
                                                }



                                            });

                                        }


                                    });
                                });
                        }
                        else {
                            rank.find({ Local: locales, fecha: new RegExp(eldiadHoy, 'i') }).exec((err, rankeo) => {

                                if (rankeo) {
                                    comentario.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, comentariodesc) => {


                                        if (comentariodesc) {
                                            visita.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                if (visitasEncontradas)
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: rankeo, comentarios: comentariodesc, visitasion: visitasEncontradas });
                                                else
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: rankeo, comentarios: comentariodesc, visitasion: '' });
                                            });

                                        }
                                        else {
                                            visita.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                if (visitasEncontradas)
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: rankeo, comentarios: '', visitasion: visitasEncontradas });
                                                else
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: rankeo, comentarios: '', visitasion: '' });
                                            });
                                        }



                                    });
                                }
                                else {
                                    comentario.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, comentariodesc) => {

                                        if (comentariodesc) {
                                            visita.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                if (visitasEncontradas)
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: comentariodesc, visitasion: visitasEncontradas });
                                                else
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: comentariodesc, visitasion: '' });
                                            });

                                        }
                                        else {
                                            visita.find({ local: locales, Fecha_Creada: new RegExp(eldiadHoy, 'i') }).sort({ 'Fecha_Creada': 1 }).exec((errComent, visitasEncontradas) => {
                                                if (visitasEncontradas)
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: '', visitasion: visitasEncontradas });
                                                else
                                                    res.status(200).send({ comander: Comanda, cuantos: counter, topten: platillos, tiempos: Time_tarde_cancel, rankin: '', comentarios: '', visitasion: '' });
                                            });
                                        }



                                    });

                                }
                            });
                        }


                    }
                });
        }
    });
}


function getActives(req, res) {
    solicitudfood.find({}).exec((err, Searching) => {
            if (err)
                res.status(500).send({ message: 'Error en Peticion de la busqueda por lat_ ' + err });
            else {
                if (Searching) {
                    const start = {
                        latitude: parseFloat(req.body.lat),
                        longitude: parseFloat(req.body.lng)
                      }
                      console.log(start)
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
                    res.status(200).send({ Locals });
                }
                else {
                    res.status(200).send({});
                }
            }
    });
}




function GetInfo(req, res)
{
    var parames = req.params;
    var tipo=parames.typer;
    var idLocal=parames.Esta;
    
    switch (tipo)
    {
        case ('hEJ03PTQrcU_'):
              //plazas
            var myLocal = solicitudfood.find({ idSquare: idLocal});
            myLocal.populate({ path: 'id_Imgs', model: 'image' }).exec((err, bussinesSquare) => {
            if (err)
              res.status(500).send({ message: 'Error en Peticion --'+err });
            else {
              if (bussinesSquare){
			    res.status(200).send({bussinesSquare});    
		    } else {	
			 res.status(404).send('resourseNotFound');     
		}
		}
	    });
		    
            break;
        case ('dnE6XnhrjrU_'):
            //Establecimientos Food            
              var dato = cambiaTipo(parames.Time);
    var Myvisit=new visita();
    Myvisit.local=idLocal;
    Myvisit.Fecha_Creada=dato;
    Myvisit.Origen='0';

    advertising.find({type: 1, IsActive: true}).exec((err, type1)=>{
        if(!err){            
            var x = Math.floor((Math.random() * type1.length));
            Myvisit.imageType1 = type1[x].id
            Myvisit.fullpicture1 = type1[x].fullPicture
        }
    }).then( res =>{  
        advertising.find({type: 2, IsActive: true}).exec((err2, type2)=>{
            if(!err2){                
                var x = Math.floor((Math.random() * type2.length));
                Myvisit.imageType2 = type2[x].id
                Myvisit.fullpicture2 = type2[x].fullPicture
            }
        })
     })
     .then( res =>{  
        advertising.find({type: 3, IsActive: true}).exec((err3, type3)=>{
            if(!err3){                
                var x = Math.floor((Math.random() * type3.length));
                Myvisit.imageType3 = type3[x].id
                Myvisit.fullpicture3 = type3[x].fullPicture
            }
        })
     })

            var myLocal = solicitudfood.findOne({ id_Hashed: idLocal});
            myLocal.populate({ path: 'id_Menu', model: 'menu' }).populate({ path: 'id_EvenPromo', model: 'eventorpromo'}).populate({ path: 'id_PaqEspe', model: 'paqespe' }).populate({ path: 'id_Imgs', model: 'image' }).exec((err, local) => {
                if (err)
                    res.status(500).send({ message: 'Error en Peticion --'+err });
                else {
                    if (!local){                       
                 Myvisit.IsActive='0';                                 
                    var soloseis=solicitudfood.find({}).sort({'Nombre':1}).limit(6);
                    soloseis.populate({ path: 'id_Imgs', model: 'image' }).exec((err, firtsSix) => {
                    Myvisit.save((err,VisitaGuardada) =>{});
                    if(err)
                    res.status(500).send({ message: 'Error en Peticion de los seis' });
                    else{
                      if(firtsSix){                        
                        res.status(200).send({firtsSix});
                      }
                      else {
                        res.status(200).send({});
                      }
                    }
                    });

                  }
                    else {                        
                       Myvisit.IsActive='1';
                       Myvisit.save((err,VisitaGuardada) =>{});
                       let imagesArr = [Myvisit.fullpicture1, Myvisit.fullpicture2, Myvisit.fullpicture3]
                       res.status(200).send({local, imagesArr});
                    }
                }
            });
            break;
        case ('Ig7ftmO2dbo='):
            //hoteles  5
            console.log('hotel');
            break;
        case ('zgCfiWxaDeo='):
            //locales
            break;
        default:
        res.status(404).send({ message: 'no hay Establecimientos de este tipo' });
    }    
}

function VerifyCode(req,res){
  var parames = req.params;

  console.log(parames);
  var codigo=parames.code;
  var Local=parames.Local;
  if(codigo!=''){
       Coders.findOne({ Codigo: codigo, status:'creado',Local:Local  },(err,coderFound)=>{
          if (err)
              res.status(500).send({ message: 'Error en Peticion'+ err });
          else {
              if (!coderFound){
                 // res.status(404).send({ message: 'No existen locales' });
                 console.log(coderFound);
              res.status(200).send({coderFound});
            }
              else {
                 // console.log(local);
                  res.status(200).send({coderFound});
              }
          }
      });
  }
}



function creauser(req,res)
{
//  comensal
  var myComensal=new comensal();
  var params=req.params;
   var localIndex = params.LocalContact.toString().split('_');
   comensal.findOne({mail:params.mail},(err,UsuarioEncontrado)=>{
     if(!err){
       if(!UsuarioEncontrado){
         var fecha = cambiaTipo(params.myfech)
	 
	       

  myComensal.mail=params.mail;
  myComensal.passCode=params.pass;
  myComensal.LocalContact[0].id = localIndex[0];
  myComensal.LocalContact[0].type = localIndex[1];
  myComensal.fechaCreate=fecha;//params.fecha;
  myComensal.sendMail=false;


  myComensal.save((err,Comensalguardado) =>{
if(err)
res.status('500').send({message:'error al guardar'+err});
else{
if(!Comensalguardado)
res.status('500').send({message:'no se registro el usuario'});
else
{
console.log('si guarda a segun');
  console.log(Comensalguardado);
   res.status('200').send({user:Comensalguardado});
}
}

});
}
else {

    console.log('Comensal encontrado');
   comensal.findByIdAndUpdate(UsuarioEncontrado.id, 
				{$push:{LocalContact:{id: localIndex[0], type:localIndex[1]} } },
			      (err, comensalUpdate) => {
	   if(err)
		   res.status('500').send({message: 'error update comensal'+err});
	   else 
		   res.status('200').send({user:comensalUpdate});
   });
				

}
}
});
}

function formatoDate(date) {
	 var d = date,//new Date(),//date.replace("GMT+0000","").replace("GMT+0100","")),
			 month = '' + (d.getMonth() + 1),
			 day = '' + d.getDate(),
			 year = d.getFullYear(),
       hour= '' +d.getHours(),
       minute='' +d.getMinutes();


	 if (month.length < 2) month = '0' + month;
	 if (day.length < 2) day = '0' + day;
   if (hour.length < 2) hour = '0' + hour;
   if (minute.length < 2) minute = '0' + minute;

	 return [day,month,year ].join('/')+' '+hour+':'+minute;
}

function validateToken(req, res) {
    var parames = req.params;
    console.log(parames.Token);

    var tok = jwt.valida(parames.Token);
    console.log('token'+tok);
    if (tok != '') {
        solicitudfood.findOne({ id_Hashed: tok.sub, id_SQL: tok.Numericparam }, (err, LocalFound) => {

            if (err) {
                  console.log('payload');
                console.log(err);
        res.status(500).send({ message: 'Error' + err });
    }
    else {
          console.log('payload2');
        console.log(LocalFound);
        if (LocalFound) {
            res.status(200).send({ token: true })
        }
        else {
            res.status(200).send({ token: null });
        }
    }
});
}
else {
  //expiro el token
    res.status(200).send({ token: null });
}
console.log(tok);
}


function makeToken(req,res){
    var parames = req.params;
    console.log(parames);
    var id=parames.hash;//.replace('_','=').replace('-','/').replace('!','+');
    //  var nombre=parames.name;
    var intId=Number(parames.numericSet);
    solicitudfood.findOne({ id_Hashed: id,  id_SQL:intId  },(err,LocalFound)=>{
        if(err){
        console.log(err);
    res.status(500).send({ message: 'Error'+ err });
}
else {
       console.log(LocalFound);
if(LocalFound){
    res.status(200).send({token:jwt.createToken(id,intId)})
}
else {
    res.status(500).send(null);
}
}
});

}


function validaHook(req, res) {
	
    const mode = req.query['hub.mode'];
	
    const challenge = req.query['hub.challenge'];
    const token = req.query['hub.verify_token'];
    if (mode && token) {
	    //console.log(process.env.VERIFYTOKEN+' '+mode);
        if (mode === 'subscribe' && token === process.env.VERIFYTOKEN) {
            console.log('si llega');
            res.status(200).send(challenge);
        }
        else {
		//console.log('primer else');
            res.status(403);
        }
    }
	else{
		console.log('segunod else');
		res.status(403);
	}
}

function recibeMesage(req,res){
	const body=req.body;
	if(body.object==='page'){
		res.status(200).send('EVENT_RECEIVED');
		body.entry.forEach(function(entry){
			let webhookEvent=entry.messaging[0];
			console.log(JSON.stringify(webhookEvent.message));
			handle.handleMessage(webhookEvent);
			//actions.sendTextMessage('Hola como estas?',webhookEvent);
		});
	}
	else{
		res.sendStatus(404);
	}
}

function userActivities(req,res){
     var parames = req.params;
     comensal.findOne({mail:parames.mail}, (err, userFound)=>{
         if(!err){
            if(userFound){
                res.status(200).send({user:userFound})
            }
            else{
                res.status(200).send({user:''})
            }
         }
         else{
             res.status(500).send({err})
         }
     })

}



module.exports = { setReservasion, userActivities, GetInfo, VerifyCode, makeToken, GetBusca, validateToken,getActives,creauser, getdashbord,GuardaRank,guardaComentarios,validaHook,recibeMesage};
