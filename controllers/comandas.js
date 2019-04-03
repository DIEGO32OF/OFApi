'use strict'


var comanda=require('../models/comandas');
var MenuCode=require('../models/Menu');
var locproces=require('../models/procesoloc');
var bcrypt=require('bcrypt-nodejs');
var Cookies = require( 'cookies' );
var jwt=require('../services/jwt');
var Codigos=require('../models/Codigo');
var mongoose = require('mongoose');


function cambiaTipo(fechaResolve) {
    var fecha = fechaResolve.replace('|', '/').replace('|', '/').replace('-', ':').replace('_', ' ')
    return fecha;
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
      Codigos.findByIdAndUpdate(parametros.Codigo,{status:'Cerrado'},(err,Code)=>{
        if(err)
        res.status(500).send({message:'error al actualizar el Codigo'+err});
      });
    }
  });
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
	    console.log(Origen+' primerPArte');
	    console.log(CodeFounit);
	    if(CodeFounit && Origen!=2){
		    var NoloTruenes=false;
		    if(CodeFounit.Origen==0)
		    {
			    if(Origen==1)
			  NoloTruenes=true
		    }	
		    if(CodeFounit.Origen==1)
		    {
			    if(Origen==0)
			  NoloTruenes=true
		    }	
		    console.log(NoloTruenes);
		    if(NoloTruenes)
	    res.status(200).send({Caracter:CodeFounit.Codigo, Open:1});
		    
		    else{
      var d = new Date();
      var hour= '' +d.getHours();
      var minute='' +d.getMinutes();
	
var idC='a';
var id=parseInt(hour);
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


          }
		    console.log('Sno habia');
	 res.status(200).send({Caracter:minute+""+idC, Open:0});
	    }
		    
		    
		    
	    }
	    else{
      var d = new Date();
      var hour= '' +d.getHours();
      var minute='' +d.getMinutes();
	
var idC='a';
var id=parseInt(hour);
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


          }
		    console.log('Sno habia');
	 res.status(200).send({Caracter:minute+""+idC, Open:0});
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

function guardaCodigoCocina(req,res){
    
    var date=new Date();
         var fecha=formatoDate(date);
    
   var mycode=new Codigos();
    var myparames=req.body;
	console.log(myparames);
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
    MenuCode.findOne({proces_Loc:req.query.LocProces, is_Active:1}, function(err, MenuCom)
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
            res.status('500').send({message:'Existe un problema por favor contacte al administrador'});
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
        payComand,
		  guardaCodigoCocina,
		  SetCaracter
      };
//};
