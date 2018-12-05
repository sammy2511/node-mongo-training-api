const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.dburl || 'mongodb://samarpit:s123456@ds157503.mlab.com:57503/notes');

mongoose.connection.once('open',() => {
    console.log('Connection successful...');
}).on('error',(e) => {
    console.log('Error occured :',e)
})

module.exports = { mongoose }
