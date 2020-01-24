'use strict'
var mongoose = require('mongoose');

var esquema = mongoose.Schema;
var reservationSchema = esquema({

    estatus: Number,
    local: String,
    fecha: date,
    Nombre: String,
    mail: String,
    telefono: Number,
    fechaReserv: date,
    numPersonas: Number 


});

module.exports = mongoose.model('reservacion', reservationSchema);
