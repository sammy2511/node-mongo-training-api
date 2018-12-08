const mongoose = require('mongoose');

var Note = mongoose.model('Note',{
  title:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
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
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Note}