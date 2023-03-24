var express = require('express'), router = express.Router();
const {ObjectId} = require('mongodb');
var Post = require('../models/post');
let client;

    //creates new post
    router.post('/add_post', async(req, res) =>{
        Post.create({
            trip_id: req.body.trip_id,
            creator_id: req.body.creator_id,
            photo_id: req.body.photo_id,
            comment: req.body.comment
        }, function(err,res2){
            if(err){
            res.send('did not work');
            console.log(err);
            }
            else{console.log(req.body);
            res.send(req.body);}
        })
    });
  
  //returns list of posts given the creator's id
  router.get('/postList', async (req, res) =>{
    Post.find({"creator_id": req.body.creator_id}).toArray((err, docs) => {
        if (err){
          console.error(err);
          return res.status(500).send('Error querying database');
        }
        console.log(docs)
  
        res.send(docs);
      })
  });
  
  //deletes existing post given post id
  router.delete('/delete/:id', (req, res) =>{
    // const id = new ObjectId(req.params.id);
    console.log(req.params.id);
    console.log(Post.findById(req.params.id));
    Post.findByIdAndDelete(req.params.id, function(err, obj){
      if(err){
        res.send(err);
      }
      res.send("1 Document Deleted")
    })});
  
  //edits the comment of a post
  router.put('/editcaption/:id', async(req, res)=>{
    var dbo = client.db(dbname);
    const id = new ObjectId(req.params.id);
    const new_caption = req.body.comment;
    dbo.collection("Posts").updateOne({"_id": id}, {$set:{"comment": new_caption}}, function(err, obj){
      if(err){
        res.send(err);
      }else{
        res.send(req.body);
      }
    })
  });
module.exports = router;