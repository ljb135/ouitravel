const express = require('express'), router = express.Router();
const Photo = require('../models/photo');
const fs = require('fs');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
  });
  
  var upload = multer({ storage: storage });

  router.post('/upload', upload.single('testImage'), (req,res)=>{
    
            const newImage = new Photo({
                name: req.body.name,
                img:{
                    data: fs.readFileSync('backend/', req.file.filename),
                    contentType:'image/png'
                }
            });
            newImage.save()
            .then(()=>res.send('successfully uploaded'))
            .catch((err)=>console.log(err));

  });
  module.exports = router;