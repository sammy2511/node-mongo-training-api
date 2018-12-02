const mongoose = require('mongoose');

var Note = mongoose.model('Note',{
  text:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  createdOn:{
      type:String,
      required:true,
      trim:true
  },
  lastModifiedOn:{
      type:String,
      required:true,
      trim:true
  }
});

module.exports = {Note}