const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://sammy2511:s@mar2511@ds157503.mlab.com:57503/notes');

mongoose.connection.once('open',() => {
    console.log('Connection successful...');
}).on('error',(e) => {
    console.log('Error occured :',e)
})

module.exports = { mongoose }
