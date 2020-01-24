'use strict'
var mongoose = require('mongoose');

var esquema = mongoose.Schema;
var reservationSchema = esquema({

    estatus: Number,
    local: String,
    fecha: String,
    Nombre: String,
    mail: String,
    telefono: Number,
    fechaReserv: String,
    numPersonas: Number ,
    activity: Number


});

module.exports = mongoose.model('reservacion', reservationSchema);
