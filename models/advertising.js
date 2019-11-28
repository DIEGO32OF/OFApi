'use strict'
var mongoose = require('mongoose');

var publicity = mongoose.Schema;
var advertisingSchema = publicity({
   
    name: String,
    Fecha_Creada: String,
    fullPicture: String,
    IsActive: Boolean,
    type: Number,
    campaign: String
});

module.exports = mongoose.model('advertising', advertisingSchema);