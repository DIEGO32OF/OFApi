'use strict'
var mongoose = require('mongoose');

var esquema = mongoose.Schema;
var ComandasSchema = esquema({

   // estatus: String,
    local: String,
    Fecha_Creada: String,
    platillo: String,
    id_Usuario: String,
    fecha_Entrega: String,
    codigoStr:String,
    platillos:[{}],
    mesa:Number,
    hashed:String,
    Estatus:Number,
   isToGo:Number,
   idService: { type: esquema.ObjectId, ref: 'servicios_domicilios' },
    


});

module.exports = mongoose.model('comanda', ComandasSchema);
