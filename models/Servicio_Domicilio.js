'use strict'
var mongoose = require('mongoose');

var Servciodomicilio = mongoose.Schema;
var homeservice= Servciodomicilio ({    
    idLocal: String,
    Nombre: String,
    Correo: String,
    Telefono:Number,
    Direccion:String,
    Fecha:String,
    lat:String,
    lng:String
});

module.exports = mongoose.model('servicios_domicilio', homeservice);
