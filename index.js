'use strict'
var mongoose = require('mongoose');
var app=require('./app');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port=process.env.PORT||3977;

/* app.set('socketio', io);
io.on('connection', function (socket) {
    console.log('conectado')
}) */

//mongoose.connect('mongodb://DiegoR:SALINIDAD1*@ds231568.mlab.com:31568/heroku_7xdfk9c8', (err,res) => {
    //mongodb+srv://Diego35:DEFTONES1*@cluster0.mitn0.mongodb.net/ofDB?retryWrites=true&w=majority
    //actual    mongodb://DiegoR:DEFTONES1*@ds245210.mlab.com:45210/heroku_bql92j6t
mongoose.connect('mongodb+srv://diego1:DEFTONES1*@cluster0.vmzh1.mongodb.net/?retryWrites=true&w=majority', (err,res) => {
    if(err)
    {        
    throw err;
}
else
{
    console.log('Register Bd correct');
    http.listen(port,function(){console.log('Server is run correct port:'+port);});
 
}
});

