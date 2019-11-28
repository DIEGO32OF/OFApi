'use strict'
var mongoose = require('mongoose');

var esquema = mongoose.Schema;
var VisitasSchema = esquema({   
    local: String,
    Fecha_Creada: String,
    Origen: String,
    IsActive: String,
    fullpicture1: String,
    fullpicture2: String,
    fullpicture3: String,
    imageType1 :{ type: esquema.ObjectId, ref: 'advertising' },
    imageType2 :{ type: esquema.ObjectId, ref: 'advertising' },
    imageType3 :{ type: esquema.ObjectId, ref: 'advertising' }


});

module.exports = mongoose.model('visita', VisitasSchema);
