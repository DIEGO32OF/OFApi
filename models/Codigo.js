'use strict'
var mongoose = require('mongoose');

var esquema = mongoose.Schema;
var CodigoSchema = esquema({

    Codigo: String,
    Mesa: Number,
    Local: Number,
    fecha_Creacion: String,    
    status: String,
    Origen:Number
    fecha_Modificado: String,
 

});

module.exports = mongoose.model('Codigo', CodigoSchema);
