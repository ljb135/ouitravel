const express = require('express'), router = express.Router();
const mongoose = require('mongoose')
const Post = require('../models/post');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage}).single('image');    
let client;

//creates new post
async function createPost(req, res) {
  if(req.user){
    //try{
      Post.create({
        _id: new mongoose.Types.ObjectId(),
        trip_id: mongoose.Types.ObjectId(req.body.trip_id),
        creator_id: mongoose.Types.ObjectId(req.body.creator_id),
        comment: req.body.comment,
        image: req.file.buffer
      });
      res.status(201).send("Successful");
    //}catch{res.send("Error")}
    }
    else{
      res.status(401).send('Not logged in');
    }
}
  
//returns list of posts given the creator's id
async function returnPosts(req, res){
  if(req.user){
    try{
      Post.find({creator_id: req.body.creator_id}, (err, docs) =>{
        if(err){
          console.error(err);
          res.status(500).send(err);
        }else{
          res.status(201).send(docs);
        }
      })
    }catch{res.send("Error")}
  }
  else{
    res.status(401).send('Not logged in');
  }
}

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