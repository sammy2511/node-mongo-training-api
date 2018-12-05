var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var { mongoose } = require('./mongoose');
var { Note } = require('./note');
var { User } = require('./user');
var moment = require('moment');
var lodash = require('lodash');
var {authenticate} = require('./authenticate')
const port = process.env.PORT || 3000;
var app = express();

//middleware
app.use(bodyParser.json());

//Post a note
app.post('/note',authenticate,(req,res) => {
  
  var note = new Note({
    text:req.body.text,
    createdOn:new Date(),
    lastModifiedOn:new Date(),
    createdBy:req.user._id
  });

  note.save().then((doc) => {
    res.send(doc);
  },(err) => {
    res.status(400).send(err);
  })
});

//Get Notes
app.get('/notes',authenticate,(req,res) =>{
  Note.find({
    createdBy:req.user._id,
    isActive:true
  }).then((Notes) => {
    res.send(Notes);
  },(err) => {
    res.status(400).send(err);
  })
});

//Get Note By ID
app.get('/note/:id',authenticate,(req,res) => {
  var id = req.params.id;

  //if not Valid ID
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Note.findOne({
    _id: id,
    isActive:true,
    createdBy:req.user._id
  }).then((note) => {
    res.send(note);
  },(err) => {
    res.status(400).send(err);
  });

});

//Delete Note By ID
app.delete('/note/:id',authenticate,(req,res) => {
  var id = req.params.id;

  //if not Valid ID
  if (!ObjectID.isValid(id)) {
    console.log('inside invalid id')
    res.status(404).send();
  }

  Note.findOneAndUpdate({
    _id:id,
    isActive:true,
    createdBy:req.user._id
  },{$set:{isActive:false}}).then((note) => {
    if(note){
      res.send(note);
    }
  },(err) => {
    res.status(400).send(err);
  });
});

app.patch('/note/:id',authenticate,(req,res) => {
  var id = req.params.id;

  //if not Valid ID
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Note.findOneAndUpdate({
    _id:id,
    isActive:true,
    createdBy:req.user._id
  },{$set:{text:req.body.text,lastModifiedOn:new Date()}}).then((note) => {
    res.send(note);
  },(err) => {
    res.status(400).send(err);
  });
});

//Route to Insert user
app.post('/users',(req,res) =>{
  var body = lodash.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then((doc) =>{
    return user.generateAuthToken();
  }).then( (token) => {
    res.header('x-auth',token).send(user.toJSON());
  }).catch((e) => {
    res.status(400).send();
  });


});



app.get('/users/me',authenticate,(req,res) => {
  res.send(req.user);
});

//Route to Login UserSchema
app.post('/users/login',(req,res) => {
  var body = lodash.pick(req.body,['email','password']);

  User.Login (body.email,body.password).then((user) => {
    //verify password
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    })
  }).catch((e) => {
    //no user found
    res.status(401).send();
  });

});

//Route to remove token
app.delete('/users/me/token',authenticate,(req,res) => {
    req.user.removeToken(req.token).then(()=>{
      res.status(200).send();
    },() =>{
      res.status(400).send();
    });
});

//starting server
app.listen(port,() => {
  console.log(`Started on port ${port}`);
})