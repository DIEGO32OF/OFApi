'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var paqespe = Schema({
  _id:String,
    descrip: String,
    Nombre: String,
    precio: String,
    Typo: Number,
    Local:Number,
    NomImg: String,
    etiquetas: String,
    Is_Active: Number,
  tamaPrice:String,
  piezas:Number
});

module.exports = mongoose.model('paqespe', paqespe);
