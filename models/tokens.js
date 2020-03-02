'use strict'
var mongoose = require('mongoose');

var tokensave = mongoose.Schema;
var token= tokensave ({       
    token: String,        
    IsActive:Boolean,
    locales: [{
        id: String,
        dateVisit: String
    }]
});

module.exports = mongoose.model('token', token);