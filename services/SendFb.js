'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('./accesKey.json')

if(admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://comandaof.firebaseapp.com'
  })
  }

console.log(admin,'------------')

 let sentToFirebase = (Tokens,  admin, title, body, ) => {

  

  const payload =  {notification: {title: title, body: body}}

  var options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
  }

  var result=''
  
  return admin.messaging().sendToDevice(Tokens, payload, options) 
 /*   .then(JSON.stringify)  
   .catch(JSON.stringify)  */ 
   .then(response => {
    console.log('Successfully sent message:', response);
    result=JSON.stringify(response)

    /* return new Promise(function (resolve,reject){
      resolve(response)
    })
     */
    return result;
})
.catch(function(error) {
  console.log('Error sending message:', error);
  result=JSON.stringify(error)
})
  
}
 module.exports = { sentToFirebase }
