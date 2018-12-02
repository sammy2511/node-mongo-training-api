var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var { mongoose } = require('./mongoose');
var { Note } = require('./note');
var moment = require('moment');
var lodash = require('lodash');
const port = process.env.PORT || 3000;
var app = express();

//middleware
app.use(bodyParser.json());

//Post a note
app.post('/note',(req,res) => {
  var note = new Note({
    text:req.body.text,
    createdOn:new Date(),
    lastModifiedOn:new Date()
  });

  note.save().then((doc) => {
    res.send(doc);
  },(err) => {
    res.status(400).send(err);
  })
});

//Get Notes
app.get('/notes',(req,res) =>{
  Note.find().then((Notes) => {
    res.send(Notes);
  },(err) => {
    res.status(400).send(err);
  })
});

//Get Note By ID
app.get('/note/:id',(req,res) => {
  var id = req.params.id;

  //if not Valid ID
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Note.findOne({
    _id: id
  }).then((note) => {
    res.send(note);
  },(err) => {
    res.status(400).send(err);
  });

});

//Delete Note By ID
app.delete('/note/:id',(req,res) => {
  var id = req.params.id;

  //if not Valid ID
  if (!ObjectID.isValid(id)) {
    console.log('inside invalid id')
    res.status(404).send();
  }

  Note.findOneAndRemove({
    _id:id
  }).then((note) => {
    if(note){
      res.send(note);
    }
  },(err) => {
    res.status(400).send(err);
  });
});

app.patch('/note/:id',(req,res) => {
  var id = req.params.id;

  //if not Valid ID
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Note.findOneAndUpdate({
    _id:id
  },{$set:{text:req.body.text,lastModifiedOn:new Date()}}).then((note) => {
    res.send(note);
  },(err) => {
    res.status(400).send(err);
  });
});

//starting server
app.listen(port,() => {
  console.log(`Started on port ${port}`);
})
