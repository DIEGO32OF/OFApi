'use strict'
var mongoose = require('mongoose');

var tokensave = mongoose.Schema;
var token= tokensave ({       
    token: String,        
    IsActive:Boolean,
    localesContact : String,
        dateVisit: String,
    idUser: String
});

module.exports = mongoose.model('token', token);
