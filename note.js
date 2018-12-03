const mongoose = require('mongoose');

var Note = mongoose.model('Note',{
  text:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  createdOn:{
      type:Date,
      required:true,
      trim:true
  },
  lastModifiedOn:{
      type:Date,
      required:true,
      trim:true
  },
  isActive:{
    type:Boolean,
    default:true
  }
});

module.exports = {Note}