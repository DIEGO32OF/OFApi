'use strict'


var comanda=require('../models/comandas');
var MenuCode=require('../models/Menu');
var locproces=require('../models/procesoloc');
var bcrypt=require('bcrypt-nodejs');
var Cookies = require( 'cookies' );
var jwt=require('../services/jwt');
var Codigos=require('../models/Codigo');
var ServiceHome=require('../models/Servicio_Domicilio');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 
var moment = require('moment');


function cambiaTipo(fechaResolve) {
    var fecha = fechaResolve.replace('|', '/').replace('|', '/').replace('-', ':').replace('_', ' ')
    return fecha;
}

function getComandsTogo(req, res){
	let params = req.body
	let myFech = cambiaTipo(params.myFech).split(' ')
	
	  var getSearch = comanda.find({ idService: {$ne : undefined}, Fecha_Creada: new RegExp(myFech[0], 'i'), local: params.local  });
        getSearch.populate({ path: 'idService', model: 'servicios_domicilio' }).exec((err, buscados) => {
		if(err)
			res.status(500).send({message:err})
		else if(buscados){
			res.status(200).send({Comandas: buscados})
		}
			
	})
}

function getComandsCuenta(req,res){
  var parametros =req.body;
  //console.log(parametros);
  if(parametros.codigo=='0'){

    var dateObj = new Date();
    var d = new Date(dateObj.toString().replace("GMT+0000","").replace("GMT+0100","")),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour= '' +d.getHours(),
        minute='' +d.getMinutes();


    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;

    var newdate= cambiaTipo(parametros.timer).split(' '); //[day,month,year ].join('/');
console.log(newdate[0] +' is may time');
    //var este='26/01/2018';//new Date('2018','01','25');
  comanda.find({$or:[{local: parametros.Local, Estatus:4,fecha_Entrega:{ $regex: '.*' + newdate[0]  + '.*' }},{local: parametros.Local, Estatus:7,fecha_Entrega:{ $regex: '.*' + newdate[0]  + '.*' }}]}, function(err, Comanda) {
      if (err) throw err;
    else
      res.status('200').send({comanda:Comanda});
  }).sort({ 'fecha_Entrega': -1 }).limit(50);
}
else {

  comanda.find({$or:[{local: parametros.Local, Estatus:4,codigoStr:parametros.codigo},{local: parametros.Local, Estatus:7,codigoStr:parametros.codigo}]}, function(err, Comanda) {
      if (err) throw err;
    else{
    //  console.log(Comanda);
      res.status('200').send({comanda:Comanda});
    }
  });
}
}

function MetePlatoExtra(req,res){
  //var Comandas=new comanda();
  var parametros=req.body;
 // console.log(parametros);
  //var objectId = new mongoose.ObjectID;
  comanda.findByIdAndUpdate(parametros.id,
  // {_id: },
   { $push : { platillos: {id:new mongoose.Types.ObjectId(),isCode: true, fechaCreado: parametros.fechaCreado,Platillo:parametros.Platillo,Mesa:parametros.Mesa,Estatus:parametros.Estatus,Cantidad:parametros.Cantidad, precio:parametros.precio}}},
    (err,PlatoGuarda)=>{
  // function(err, PlatoGuarda){
          if(err){
              res.send(err);
          }else{
              res.status('200').send({PlatoGuarda});
          }
});
}

function payComand(req, res){
  var parametros=req.body;
  //console.log(parametros);
  comanda.findByIdAndUpdate(parametros.id,{Estatus:7},(err, Comand)=>{
    if(err)
    res.status(500).send({message:'error al actualizar la comanda'+err});
    else{
	    if(parametros.Codigo!=''){
		   
      Codigos.findByIdAndUpdate(parametros.Codigo,{status:'Cerrado'},(err,Code)=>{
        if(err)
        res.status(500).send({message:'error al actualizar el Codigo'+err});
	      else
		      res.status(200).send({message:'Se actualizo correctamente el codigo y comanda'});
      });
		    
	    }
	    else
		    res.status(200).send({message:'Se actualizo correctamente la comanda'});
    }
  });
}

function GetComandByTable(req,res){
  var parames = req.body;
  var codigo=parames.code;
  var Local=parames.Local;
    console.log('x aca');
  console.log(codigo+'---'+Local);
  if(codigo!=''){
      var Codigoget = comanda.find({ mesa: codigo ,local:Local  },(err,ComandFounder)=>{
          if (err)
              res.status(500).send({ message: 'Error en Peticion' });
          else {
              if (!ComandFounder)
                 // res.status(404).send({ message: 'No existen locales' });
              res.status(200).send({ComandFounder});
              else {
                  console.log(ComandFounder);
                  res.status(200).send({ComandFounder});
              }
          }
      });
  }
}

function GetComandByCode(req,res){
  var parames = req.body;
  var codigo=parames.code;
  var Local=parames.Local;
    console.log('x aca');
  console.log(codigo+'---'+Local);
  if(codigo!=''){
      var Codigoget = comanda.findOne({ codigoStr:  new RegExp(codigo, 'i'),local:Local  },(err,ComandFounder)=>{
          if (err)
              res.status(500).send({ message: 'Error en Peticion' });
          else {
              if (!ComandFounder)
                 // res.status(404).send({ message: 'No existen locales' });
              res.status(200).send({ComandFounder});
              else {
                  console.log(ComandFounder);
                  res.status(200).send({ComandFounder});
              }
          }
      });
  }
}



function SetCaracter(req, res){
	
    var parametros =req.body;
    
	var parames = req.params;
	var local=parametros.Local;
    var meson=parametros.Mesa;
  try{
        meson = parseInt(meson)
    }
    catch(ex){ console.log(meson+' '+ ex)}
	var Origen=parametros.Origen;
	if(local==undefined)
	{
		local=parames.Local;
		meson=parames.Mesa;
		Origen=parames.Origen;
    }
		
	 Codigos.findOne({Local: local, status:'creado',Mesa:meson}, (err, CodeFounit)=> {
      if (err) throw err;
    else{

	    if(CodeFounit && Origen!=2){
		    var NoloTruenes=false;
		    if(CodeFounit.Origen==0)
		    {			    
			  NoloTruenes=true
		    }	
		    if(CodeFounit.Origen==1)
		    {
			    //if(Origen==0)
			  NoloTruenes=true
		    }			    
		    if(NoloTruenes){

            /*     try{
                    var io = req.app.get('socketio');    
                        console.log('connected 2');        
                        io.emit('test', JSON.stringify(CodeFounit.Codigo));
                
                }
                catch(err){
                    console.log(err)
                } */

        res.status(200).send({Caracter:CodeFounit.Codigo, Open:1});
            }
		    
		    else{
      var d = new Date();
      var hour= '' +d.getSeconds();
      var minute='' +d.getMinutes();
	
var idC='a';
var id=parseInt(minute);
          switch (id)
          {
              case 0:
                  idC = 'A';
                  break;
              case 1:
                  idC = 'B';
                  break;
              case 2:
                  idC = 'C';
                  break;
              case 3:
                  idC = 'D';
                  break;
              case 4:
                  idC = 'E';
                  break;
              case 5:
                  idC = 'F';
                  break;
              case 6:
                  idC = 'G';
                  break;
              case 7:
                  idC = 'H';
                  break;
              case 8:
                  idC = 'I';
                  break;
              case 9:
                  idC = 'J';
                  break;
              case 10:
                  idC = 'K';
                  break;
              case 11:
                  idC = 'L';
                  break;
              case 12:
                  idC = 'M';
                  break;
              case 13:
                  idC = 'N';
                  break;
              case 14:
                  idC = 'O';
                  break;
              case 15:
                  idC = 'P';
                  break;
              case 16:
                  idC = 'Q';
                  break;
              case 17:
                  idC = 'R';
                  break;
              case 18:
                  idC = 'S';
                  break;
              case 19:
                  idC = 'T';
                  break;
              case 20:
                  idC = 'U';
                  break;
              case 21:
                  idC = 'V';
                  break;
              case 22:
                  idC = 'X';
                  break;
              case 23:
                  idC = 'Y';
                  break;
              case 24:
                  idC = 'Z';
                  break;
			   case 25:
                  idC = 'A1';
                  break;
			   case 26:
                  idC = 'B2';
                  break;
			   case 27:
                  idC = 'C3';
                  break;
			   case 28:
                  idC = 'D4';
                  break;
			   case 29:
                  idC = 'E5';
                  break;
			   case 30:
                  idC = 'F6';
                  break;
			   case 31:
                  idC = 'G7';
                  break;
			   case 32:
                  idC = 'H8';
                  break;
			   case 33:
                  idC = 'I9';
                  break;
			   case 34:
                  idC = 'J0';
                  break;
			   case 35:
                  idC = 'KA';
                  break;
			   case 36:
                  idC = 'L1';
                  break;
			   case 37:
                  idC = 'MB';
                  break;
			   case 38:
                  idC = 'N2';
                  break;
			   case 39:
                  idC = 'OC';
                  break;
			   case 40:
                  idC = 'P3';
                  break;
			   case 41:
                  idC = 'QD';
                  break;
			   case 42:
                  idC = 'R4';
                  break;
			   case 43:
                  idC = 'SE';
                  break;
			   case 44:
                  idC = 'T5';
                  break;
			   case 45:
                  idC = 'UF';
                  break;
			   case 46:
                  idC = 'V6';
                  break;
			   case 47:
                  idC = 'W7';
                  break;
			   case 48:
                  idC = 'X8';
                  break;
			   case 49:
                  idC = 'Y9';
                  break;
			   case 50:
                  idC = 'Z0';
                  break;
			   case 51:
                  idC = '1D';
                  break;
			   case 52:
                  idC = '2E';
                  break;
			   case 53:
                  idC = '3F';
                  break;
		  case 54:
                  idC = '4G';
                  break;
			   case 55:
                  idC = '5H';
                  break;
			   case 56:
                  idC = '6I';
                  break;
			   case 57:
                  idC = '7J';
                  break;
			   case 58:
                  idC = '8K';
                  break;
			   case 59:
                  idC = '9L';
                  break;
			   case 60:
                  idC = '0M';
                  break;


          }
          if(parametros.nombre != ''){
            var date=new Date();
            var fecha=formatoDate(date);
       var servicio=new ServiceHome();
       servicio.idLocal=parametros.id_Hashed;
       servicio.Nombre=parametros.nombre;
       servicio.Correo=parametros.mail;
       servicio.Telefono=parametros.cel;
       servicio.Direccion=parametros.direction;
       servicio.lat=parametros.lat;
       servicio.lng=parametros.lng;
       servicio.Fecha=fecha;
       servicio.IsActive=1;
       
       servicio.save((err,ServicioGuardado) =>{
           
   if(err)
     console.log(err)
   else{
   if(!ServicioGuardado){
  /*   try{
        var io = req.app.get('socketio');    
            console.log('connected 3');        
            io.emit('test', JSON.stringify(req.body));
    
    }
    catch(err){
        console.log(err)
    } */
   res.status(200).send({Caracter:hour+""+idC, Open:0, idService: null});
   }
   else
   {          
   /*     try{
        var io = req.app.get('socketio');    
            console.log('connected 4');        
            io.emit('test', JSON.stringify(req.body));
    
    }
    catch(err){
        console.log(err)
    } */
       res.status(200).send({Caracter:hour+""+idC, Open:0, idService: ServicioGuardado._id });
   }
   }
   });
        }
        else{
           /*  try{
                var io = req.app.get('socketio');    
                    console.log('connected 5');        
                    io.emit('test', JSON.stringify(req.body));
            
            }
            catch(err){
                console.log(err)
            } */
            res.status(200).send({Caracter:hour+""+idC, Open:0, idService: null});
        }
            
	 
	    }
		    
		    
		    
	    }
	    else{
      var d = new Date();
      var hour= '' +d.getHours();
      var minute='' +d.getMinutes();
	
var idC='a';
var id=parseInt(minute);
          switch (id)
          {
              case 0:
                  idC = 'A';
                  break;
              case 1:
                  idC = 'B';
                  break;
              case 2:
                  idC = 'C';
                  break;
              case 3:
                  idC = 'D';
                  break;
              case 4:
                  idC = 'E';
                  break;
              case 5:
                  idC = 'F';
                  break;
              case 6:
                  idC = 'G';
                  break;
              case 7:
                  idC = 'H';
                  break;
              case 8:
                  idC = 'I';
                  break;
              case 9:
                  idC = 'J';
                  break;
              case 10:
                  idC = 'K';
                  break;
              case 11:
                  idC = 'L';
                  break;
              case 12:
                  idC = 'M';
                  break;
              case 13:
                  idC = 'N';
                  break;
              case 14:
                  idC = 'O';
                  break;
              case 15:
                  idC = 'P';
                  break;
              case 16:
                  idC = 'Q';
                  break;
              case 17:
                  idC = 'R';
                  break;
              case 18:
                  idC = 'S';
                  break;
              case 19:
                  idC = 'T';
                  break;
              case 20:
                  idC = 'U';
                  break;
              case 21:
                  idC = 'V';
                  break;
              case 22:
                  idC = 'X';
                  break;
              case 23:
                  idC = 'Y';
                  break;
              case 24:
                  idC = 'Z';
                 break;
			   case 25:
                  idC = 'A1';
                  break;
			   case 26:
                  idC = 'B2';
                  break;
			   case 27:
                  idC = 'C3';
                  break;
			   case 28:
                  idC = 'D4';
                  break;
			   case 29:
                  idC = 'E5';
                  break;
			   case 30:
                  idC = 'F6';
                  break;
			   case 31:
                  idC = 'G7';
                  break;
			   case 32:
                  idC = 'H8';
                  break;
			   case 33:
                  idC = 'I9';
                  break;
			   case 34:
                  idC = 'J0';
                  break;
			   case 35:
                  idC = 'KA';
                  break;
			   case 36:
                  idC = 'L1';
                  break;
			   case 37:
                  idC = 'MB';
                  break;
			   case 38:
                  idC = 'N2';
                  break;
			   case 39:
                  idC = 'OC';
                  break;
			   case 40:
                  idC = 'P3';
                  break;
			   case 41:
                  idC = 'QD';
                  break;
			   case 42:
                  idC = 'R4';
                  break;
			   case 43:
                  idC = 'SE';
                  break;
			   case 44:
                  idC = 'T5';
                  break;
			   case 45:
                  idC = 'UF';
                  break;
			   case 46:
                  idC = 'V6';
                  break;
			   case 47:
                  idC = 'W7';
                  break;
			   case 48:
                  idC = 'X8';
                  break;
			   case 49:
                  idC = 'Y9';
                  break;
			   case 50:
                  idC = 'Z0';
                  break;
			   case 51:
                  idC = '1D';
                  break;
			   case 52:
                  idC = '2E';
                  break;
			   case 53:
                  idC = '3F';
                  break;
		  case 54:
                  idC = '4G';
                  break;
			   case 55:
                  idC = '5H';
                  break;
			   case 56:
                  idC = '6I';
                  break;
			   case 57:
                  idC = '7J';
                  break;
			   case 58:
                  idC = '8K';
                  break;
			   case 59:
                  idC = '9L';
                  break;
			   case 60:
                  idC = '0M';
                  break;


          }          
          if(parametros.nombre != ''){
            var date=new Date();
         var fecha=formatoDate(date);
	var servicio=new ServiceHome();
    servicio.idLocal=parametros.id_Hashed;
    servicio.Nombre=parametros.nombre;
    servicio.Correo=parametros.mail;
    servicio.Telefono=parametros.cel;
    servicio.Direccion=parametros.direction;
    servicio.lat=parametros.lat;
    servicio.lng=parametros.lng;
	servicio.Fecha=fecha;
	servicio.IsActive=1;
	
	servicio.save((err,ServicioGuardado) =>{        
if(err)
  console.log(err)
else{
if(!ServicioGuardado)
res.status(200).send({Caracter:hour+""+idC, Open:0, idService: null});
else
{       
    res.status(200).send({Caracter:hour+""+idC, Open:0, idService: ServicioGuardado._id });
}
}
});
        }
        else{
            res.status(200).send({Caracter:hour+""+idC, Open:0, idService: null});
        }
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


function DameServicio(req,res){
	  var parames = req.body;
  var id=parames.Servicio;
  var Local=parames.Local;
	//var idOk=new ObjectId(id);
	var date=new Date();
         var fecha=formatoDate(date);
	var prefix=fecha.split(' ');
	//ServiceHome.findOne({_id:idOk },(err,ServiceFounder)=>{
		ServiceHome.find({idLocal:Local,Fecha:new RegExp(prefix[0], 'i') },(err,ServiceFounder)=>{
          if (err)
              res.status(500).send({ message: 'Error en Peticion' });
          else {            
             
                  
                  res.status(200).send({ServiceFounder});
             
          }
      });
}

function GuardaServDomFromkitchen(Local, Nombre, correo,telefono, direccion, lat, lng ){
    var date=new Date();
         var fecha=formatoDate(date);
	var servicio=new ServiceHome();
	servicio.idLocal=Local;
	servicio.Nombre=Nombre;
	servicio.Correo=correo;
	servicio.Telefono=telefono;
	servicio.Direccion=direccion;
	servicio.lat=lat;
	servicio.lng=lng;
	servicio.Fecha=fecha;
	servicio.IsActive=1;
	
	servicio.save((err,ServicioGuardado) =>{        
if(err)
  return null
else{
if(!ServicioGuardado)
return null
else
{     
    return ServicioGuardado._id 
}
}
});
}

function ServicioDomGuarda(req,res){
 var parametros =req.body;	
	var date=new Date();
         var fecha=formatoDate(date);
	var servicio=new ServiceHome();
	servicio.idLocal=parametros.Local;
	servicio.Nombre=parametros.Nombre;
	servicio.Correo=parametros.correo;
	servicio.Telefono=parametros.telefono;
	servicio.Direccion=parametros.direccion;
	servicio.lat=parametros.lat;
	servicio.lng=parametros.lng;
	servicio.Fecha=fecha;
	servicio.IsActive=1;
	
	servicio.save((err,ServicioGuardado) =>{
if(err)
  res.status('500').send({message:'error al guardar'+err});
else{
if(!ServicioGuardado)
res.status('500').send({message:'no se registro el servicio'});
else
{ 
    console.log(ServicioGuardado);
     res.status('200').send({IdService:ServicioGuardado});
}
}
});
}

function getAllCodesLocal(req, res){
    let myparames=req.body;	
    Codigos.find({Local: myparames.local , status: 'creado', fecha_Creacion: myparames.fecha}, function(err,myCodes){
if(err)
res.status(200).send({codes: []})
else{
    
    if(myCodes){
    res.status(200).send({codes: myCodes})
    }
    else
    res.status(200).send({codes: []})
}
    })
}


function guardaCodigoCocina(req,res){
    
    var date=new Date();
         var fecha=formatoDate(date);
    
   var mycode=new Codigos();
    var myparames=req.body;	
    mycode.Codigo=myparames.Codigo;
    mycode.Mesa=myparames.Mesa;
   mycode.Local=myparames.Local;
   mycode.status= 'creado';
   mycode.Origen=myparames.Origen;
    mycode.fecha_Creacion=fecha;
	var meson=parseInt(myparames.Mesa);
	
	Codigos.updateMany({Local:myparames.Local,Mesa:meson},{$set: {status:'Cerrado'}}, function(err, cerrados) {
    if (err) {
      res.status('500').send({message:'error en el cerrar codigos'+err});
    }
   else
   {
  console.log(cerrados);
	
	mycode.save((err,codigoGuardado) =>{
if(err)
  res.status('500').send({message:'error al guardar'+err});
else{
if(!codigoGuardado)
res.status('500').send({message:'no se registro el codigo'});
else
{
  console.log('si guarda el codigo');
    console.log(codigoGuardado);
     res.status('200').send({Mycodigo:codigoGuardado});
}
}

});
	    }
  });
//});
}

//guarda comanda
function SetComandas(req,res)
{
    var Comandas=new comanda();
    var params=req.body;
     console.log(params);
    Comandas.codigoStr=params.codigoStr;
    Comandas.local=params.local;
    Comandas.Fecha_Creada=params.Fecha_Creada;
    Comandas.platillos=params.platillos;
    Comandas.fecha_Entrega=params.fecha_Entrega;
    Comandas.Estatus=params.Estatus;
	Comandas.idService = params.idService;
	Comandas.mesa=params.mesa;
	if(params.Allevar)
	Comandas.isToGo=1;
	else
	Comandas.isToGo=0;
	

  var newdate=Comandas.Fecha_Creada.split(' ');
    

  comanda.find({codigoStr:Comandas.codigoStr,Fecha_Creada: { $regex: '.*' + newdate[0] + '.*' }}, function(err, Comandexistente) {
  console.log(Comandexistente);
    if(Comandexistente!=''){
          comanda.findByIdAndUpdate(Comandexistente[0].id,{platillos: []},
        (err,PlatoUpdate)=>{
            
      
for(var e=0;e<params.platillos.length;e++){
   // var existeUpdate=false;
   // for(var l=0; l<Comandexistente[0].platillos.length;l++){
   //     if(params.platillos[e].id==Comandexistente[0].platillos.id){
   //     existeUpdate=true;
   //     l=Comandexistente[0].platillos.length;
   //     }
   // }
   // if(existeUpdate){
     
    //}
   // else{
      comanda.findByIdAndUpdate(Comandexistente[0].id,
       { $push : { platillos: {id:new mongoose.Types.ObjectId(),isCode: true, fechaCreado: params.platillos[e].fechaCreado,Platillo:params.platillos[e].Platillo, costo:params.platillos[e].costo,callMesero:params.platillos[e].callMesero,Mesa:params.platillos[e].Mesa,Estatus:params.platillos[e].Estatus,Cantidad:params.platillos[e].Cantidad, precio:params.platillos[e].precio}}},
        (err,PlatoGuarda)=>{
          if(e+1==params.platillos.length)
               res.status('200').send({Comandas:PlatoGuarda});
        });
    //}
      }
                                                                         });
    }
    else {
    //comanda.remove({codigoStr:Comandas.codigoStr,Fecha_Creada: { $regex: '.*' + newdate[0] + '.*' }},1);
   // comanda.remove({codigoStr:Comandas.codigoStr},1);

  
    Comandas.save((err,ComandaGuardada) =>{
if(err)
  res.status('500').send({message:'error al guardar'+err});
else{
if(!ComandaGuardada)
res.status('500').send({message:'no se registro el usuario'});
else
{
  console.log('si guarda a segun');
    console.log(ComandaGuardada);
     res.status('200').send({Comandas:ComandaGuardada});
}
}

});
}
});
}

//busca comanda
function verifycode(req, res)
{
    //console.log(req.query.Local);
    comanda.find({local: req.query.Local, status:'Solicitado'}, function(err, Comanda) {
        if (err) throw err;

        // object of all the users
      //  console.log(Comanda);
        res.status('200').send({comanda:Comanda});
    });
}

//busca menu
function setloc(req, res)
{
    MenuCode.findOne({proces_Loc:req.query.LocProces}, function(err, MenuCom)
    {
        if (err) throw err;
        //  res.status('200').sendFile(__dirname+'/Command_View.html');
        var locProces='';
        if(MenuCom!=null)
        {

            var categorias='';

            var onlyMenu=MenuCom.menu;
           // console.log(onlyMenu);
            if(onlyMenu!=null)
            {
                for(var i=0; i<onlyMenu.length;i++)
                {
                    categorias+='|'+onlyMenu[i].Categoria;
                }
               // localStorage.setItem('keyProces', locProces+categorias);
            }

            bcrypt.hash(MenuCom.id_Local,null,null,function(err,hash){
             //   console.log(hash);
                locProces=hash;


                //res.cookie('ProcesLoc',locProces+categorias,{ expires: new Date(Date.now() + 2000) }).status('200').sendFile(__dirname+'../Command_View.html');
                res.cookie('ProcesLoc',locProces+categorias,{ expires: new Date(Date.now() + 2000) }).status('200').sendFile('C:/Users/QUENU_000/Desktop/VERSIONES_PIXKY/OrdenoFacil200117/FacilOrdeno/ApiNode/apiordenofacil/Command_View.html');

            });



        }
    });

}

//Busca  en otro diria que no sirve
function GetComand(req, res)
{
    //var params=req.query;
    //console.log(req.query.LocProces);
    var idlocal=0;
    locproces.findOne({locproces:req.query.LocProces,isactive:1}, function(err, loc) {
        if (err) throw err;
        //  res.status('200').sendFile(__dirname+'/Command_View.html');
        if(loc!=null)
        {
          //  console.log(loc);
            //idlocal=loc.idLocal;
            res.status('200').send({locer:loc});
        }
        else
        {
            res.status('200').send({message:'Existe un problema por favor contacte al administrador'});
        }

    });



}

function EntregaCOmanda(req,res)
{
    var Idcmanda=req.params.id;
    console.log(Idcmanda);
    var params=req.body;
    comanda.findByIdAndUpdate(Idcmanda,params, (err, CamandaActual)=>
        {
            if(err)
            res.status(500).send({message:'error al actualizar la comanda'});
else
{
    if(!CamandaActual)
    res.status(404).send({message:'no se actualizo la comanda'});
else
    res.status(200).send({CamandaActual});
}
});
}

module.exports = {GetComand,
       SetComandas,
    verifycode,
        setloc,    
        EntregaCOmanda,
        MetePlatoExtra,
        getComandsCuenta,
        GetComandByCode,
		  GetComandByTable,
        payComand,
		  guardaCodigoCocina,
		  SetCaracter,
		  ServicioDomGuarda,
		  DameServicio,
          getComandsTogo,
          getAllCodesLocal
      };
//};
