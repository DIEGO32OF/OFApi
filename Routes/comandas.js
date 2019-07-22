'use strict'

var expres = require('express');
var ComandasControllers = require('../controllers/comandas');
var md_Auth = require('../midleware/autenticate');
var api = expres.Router();

api.get('/GetComand', ComandasControllers.GetComand);
api.post('/SetComandas', ComandasControllers.SetComandas);
api.get('/GetComandas', ComandasControllers.verifycode);
api.get('/setProces', ComandasControllers.setloc);
api.put('/update-user/:id', md_Auth.ensureAuth, ComandasControllers.EntregaCOmanda);
api.post('/newPlatillo',ComandasControllers.MetePlatoExtra);
api.post('/myCount',ComandasControllers.getComandsCuenta);
api.post('/GetComandByCode',ComandasControllers.GetComandByCode);
api.post('/GetComandByTable',ComandasControllers.GetComandByTable);
api.post('/PayComand',ComandasControllers.payComand);
api.post('/guardaCodigoCocina',ComandasControllers.guardaCodigoCocina);
api.post('/SetCaracter/:Local/:Mesa/:Origen',ComandasControllers.SetCaracter);
api.post('/SaveDirectTogo',ComandasControllers.ServicioDomGuarda);
api.post('/GetServicio',ComandasControllers.DameServicio);







module.exports = api;
