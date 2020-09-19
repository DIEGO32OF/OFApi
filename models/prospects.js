'use strict'
var mongoose = require('mongoose');
const moment = require('moment')

var esquema = mongoose.Schema;
var prospectSchema = esquema({

    senderId:{
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {type: String},
    gender: { type: String},    
    locale: { type: String},
    timezone:{ type: String},
    email:{type: String},
    address: {type: String},
    contacted : { type: Boolean},
    createdAt:{
        type: Date,
        required: true,
        default: moment().format()
    },
    updateAt:{
        type:Date,
        required: true,
        default: moment().format()
    }
 

});

module.exports = mongoose.model('prospectos', prospectSchema);