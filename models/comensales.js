'use strict'
var mongoose = require('mongoose');

var comensal= mongoose.Schema;
var localFood = comensal({
  //  _id: String,
    mail:String,
    passCode:String,
    fechaCreate:String,
    LocalContact:[{id:String, type:Number}],
    sendMail:Boolean,



});

module.exports = mongoose.model('comensales', localFood);
