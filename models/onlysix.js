'use strict'
var mongoose = require('mongoose');

var localonly = mongoose.Schema;
var localsix= localonly({
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
  //  id_Menu: { type: local.ObjectId, ref: 'menu' },
  //  id_EvenPromo: [{ type: local.ObjectId, ref: 'eventorpromo' }],
  //  id_PacEspe: [{ type: local.ObjectId, ref: 'paqespe' }]     ,
    id_Imgs: [{ type: localonly.ObjectId, ref: 'image' }]

});

module.exports = mongoose.model('local', localsix);
