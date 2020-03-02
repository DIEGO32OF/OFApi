'use strict'

var expres = require('express');
var SolicitudPrimera = require('../controllers/solicitud');
var md_Auth = require('../midleware/autenticate');
var api = expres.Router();

api.post('/getordereasy/:typer/:Esta/:Time', SolicitudPrimera.GetInfo);
api.post('/VerifyCode/:code/:Local', SolicitudPrimera.VerifyCode);
api.post('/CheckOptions/:hash/:numericSet', SolicitudPrimera.makeToken);
api.post('/searchGet/:typer/:Busqueda', SolicitudPrimera.GetBusca);
api.post('/SearchNear/', SolicitudPrimera.getActives);
api.post('/Vigenciacheck/:Token/', SolicitudPrimera.validateToken);
api.post('/newValidateUser/:mail/:pass/:LocalContact/:myfech', SolicitudPrimera.creauser);
api.post('/saverComent', SolicitudPrimera.guardaComentarios);
api.post('/getdash/:typer/:Esta/:Time', SolicitudPrimera.getdashbord);
api.post('/rankeo', SolicitudPrimera.GuardaRank);
api.get('/webhook', SolicitudPrimera.validaHook);
api.post('/webhook', SolicitudPrimera.recibeMesage);
api.post('/activitiesUser/:mail', SolicitudPrimera.userActivities);
api.post('/setReservation/:nombre/:fechaReserv/:personas/:mail/:local/:telefono/:solicitado', SolicitudPrimera.setReservasion);
api.post('/saveToken/', SolicitudPrimera.saveToken);


module.exports = api;
