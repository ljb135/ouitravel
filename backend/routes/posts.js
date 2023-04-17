const express = require('express'), router = express.Router();
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Post = require('../models/post');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage}).single('image');    
let client;


//creates new post
async function createPost(req, res) {
  if(req.user){
    try{
      Post.create({
        _id: new mongoose.Types.ObjectId(),
        trip_id: mongoose.Types.ObjectId(req.body.trip_id),
        creator_id: mongoose.Types.ObjectId(req.user._id),
        comment: req.body.comment,
        image: req.file.buffer
      });
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.status(201).send("Successful");
    }catch{res.send("Error")}
    }
    else{
      res.status(401).send('Not logged in');
    }
}


//returns list of posts given the creator's id
async function returnPosts(req, res){
  if(req.user){
    try{
      Post.find({creator_id: req.user._id}, (err, docs) =>{
        if(err){
          console.error(err);
          res.status(500).send(err);
        }else{
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.json(docs);
        }
      })
    }catch{res.send("Error")}
  }
  else{
    res.status(401).send('Not logged in');
  }
}
/*
function returnPosts(req, res){
  if(req.user){
      Post.find({creator_id: req.user._id}).then(post => res.status(200).send(json(post)));
  }
  else{
      res.redirect(401, "http://localhost:3000/login");
  }
}
*/
//deletes existing post given post id
async function deletePost(req, res){
  if(req.user){
    try{
      Post.findByIdAndDelete(req.params.id, (err, deletedDoc) =>{
        if(err){
          console.error(err);
          res.status(500).send(err);
        }else if(!deletedDoc){
          res.status(404).send('Document not found');
        }else{
          res.send("Document Deleted");
        }
      })
    }catch{res.send("Error")}
    }
    else{
      res.status(401).send('Not logged in');
    }
}
/*  
//edits element(caption, photos) of an existing post
async function editPost(req, res){
  if(req.user){
    try{
      const updatedPost = {};
      updatedPost[req.body.keyToUpdate] = req.body.valueToUpdate;
      Post.findByIdAndUpdate(req.params.id, updatedPost, {new:true}, (err, updatedDoc) => {
        if(err){
          console.error(err);
          res.status(500).send(err);
        }else if(!updatedDoc){
          res.status(404).send('Document not found');
        }else{
          res.status(200).send(updatedDoc);
        }
      })
    }catch{res.send("Error")}
  }
  else{
    res.status(401).send('Not logged in');
  }
}  
*/

async function editPost(req, res){
  if(req.user){
    try{
      const { id } = req.params;
      const { fieldName, newValue } = req.body;
      const doc = await Post.findById(id);
      doc[fieldName] = newValue;
      const updatedDoc = await doc.save();
      res.status(200).send(updatedDoc);


    }catch{res.send("Error")}
  }
  else{
    res.status(401).send('Not logged in');
  }
}
router.post('/post',upload, createPost);
router.get('/postList', returnPosts);
router.put('/editcaption/:id', editPost);
router.delete('/delete/:id', deletePost);
module.exports = router;