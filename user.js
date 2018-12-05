const mongoose = require('mongoose');
const validator = require('validator');
const webToken = require('jsonwebtoken');
const _ = require('lodash');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email:{
    required:true,
    type:String,
    minlength:1,
    trim:true,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'{VALUE} is not a valid Email'
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6,
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token =  webToken.sign({_id:user._id.toHexString(),access:access},'abc').toString();

  user.tokens.push({
    access:access,
    token:token
  });

  return user.save().then(() => {
    return token;
  });
}

UserSchema.methods.removeToken = function (token){
  var user = this;

  return user.update({
    $pull:{
      tokens:{token}
    }
  });
}

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try {
    decoded = webToken.verify(token,'abc');
  } catch (e) {
    return Promise.reject('Authentication Required');
  }

  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access': 'auth'
  })
}

UserSchema.pre('save',function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }

});

UserSchema.statics.Login = function(email,password){
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve,reject) => {
      bcrypt.compare(password,user.password,(err,res) => {
        if(res){
          resolve(user);
        }else {
          reject();
        }
      });
    });

  });

}

var User = mongoose.model('User',UserSchema);

module.exports = {User}
