const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.dburl);

mongoose.connection.once('open',() => {
    console.log('Connection successful...');
}).on('error',(e) => {
    console.log('Error occured :',e)
})

module.exports = { mongoose }
