'use strict'
var mongoose = require('mongoose');

var local = mongoose.Schema;
var localFood = local({
    _id: String,
    id_SQL: Number,
    id_Hashed: String,
    Nombre: String,
    tipo: Number,
    encuesta: String,
    slogan: String,
    Domicilio: String,
    telefono: Number,
    redes: String,
    correo: String,
    url: String,
    nom_ico: String,
    nom_img: String,
    isActive: Number,
    setComand: Number,
    servDom: Number,
    idSquare: String,
     lat: String,
    lng: String,
    id_Menu: { type: local.ObjectId, ref: 'menu' },
    id_EvenPromo: [{ type: local.ObjectId, ref: 'eventorpromo' }],
    id_PaqEspe: [{ type: local.ObjectId, ref: 'paqespe' }]     ,
    id_Imgs: [{ type: local.ObjectId, ref: 'image' }]

});

module.exports = mongoose.model('locales', localFood);
