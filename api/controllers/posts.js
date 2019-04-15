const mongoose = require('mongoose');
const Post = require('../models/post');


exports.post_create =   (req, res, next) =>{   

    console.log(req.file);

    const post = new Post({        
        title: req.body.title,
        content: req.body.content,
        userPostID : req.body.userPostID,
        postImage: req.file.path
    });

    post
        .save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: 'Post create',
                postDetails: result
            });            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });


}

exports.post_delete = (req, res, nest) =>{
    
    const id= req.params.postId;
    Post
        .remove({_id : id})
        .exec()
        .then(doc =>{
            console.log(doc);
            res.status(200).json({message: 'delete success'});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
   
}


exports.post_all =  (req, res, next) =>{

    Post
    .find()
    .exec()
    .then(doc =>{
        console.log(doc);
        if(doc.length > 0){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message : "No Post found"});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });

   
}


exports.post_one_show =  (req, res, nest) =>{
    const id = req.params.postId;

    Post
        .findById(id)
        .exec()
        .then(doc =>{
            console.log(doc);
            if(doc){
                res.status(200).json({"Single Post Details" : doc});
            }else{
                res.status(404).json({message : "No valid entry found for POST ID"});
            }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
 
}


exports.post_edit_details_get =  (req, res, nest) =>{
    const id= req.params.postId;

    Post
        .findById(id)
        .exec()
        .then(doc =>{
            console.log(doc);
            if(doc){
                res.status(200).json({"Post Details for Edit " : doc});
            }else{
                res.status(404).json({message : "No valid entry fund for provided ID"});
            }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
 
}

exports.post_edit_details_save = (req, res, nest) =>{
    const id= req.params.postId;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    //Product.update( { _id: id } , { $set: {name: req.body.name, price: req.body.price} });
    Post
    .update( { _id: id } , { $set: updateOps })
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json({"Post Update ":doc});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });


}

