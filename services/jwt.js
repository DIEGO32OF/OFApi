'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret='mi_secretilloillo';




exports.valida = function (Token) {
    var payload = '';
    try {
        payload = jwt.decode(Token, secret);
        console.log(payload);
          if (payload.exp <= moment.unix()) {
        //    //res.status(401).send({ message: 'el token expiro' });
            return '';
        }
    }
    catch (ex) {
        payload = '';
    }
    return payload;
}

exports.createToken = function (id_hashed,intId) {
    var pailoat = {
        sub: id_hashed,
      //  nombre:nombre,
        Numericparam:intId,
        //mai:user.email,
        //role:user.role,
        //image:user.image,
        //iat:moment().unix(),
        exp:moment().add(1,'days').unix(),
    }
    console.log( jwt.encode(pailoat,secret));
    return jwt.encode(pailoat,secret);
};
