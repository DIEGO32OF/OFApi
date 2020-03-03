'use strict'
var mongoose = require('mongoose');

var tokensave = mongoose.Schema;
var token= tokensave ({       
    token: String,        
    IsActive:Boolean,
    localesContact : [{ id: String, dateVisit: String }],
    idUser: String
});

module.exports = mongoose.model('token', token);
