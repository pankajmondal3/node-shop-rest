const mongoose = require('mongoose');
const Post = require('../models/post');


exports.post_create =   (req, res, next) =>{   

    console.log(req.file);
    res.status(200).json(req.body);
    
    const post = new Post({        
        title: req.body.title,
        content: req.body.content,
        userPostID: req.userData.userId, //userPostID : req.body.userPostID, 
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

exports.post_edit_save = (req, res, nest) =>{
    //console.log('ok')

   const id= req.params.postId; 
   let updateOpsVal = {};

  //  const updateOps = {};

    //return res.status(200).json(req.userData.userId);

    // for(const ops of req.body){
      //   updateOps[ops.propName] = ops.value;
     //}

     //console.log(updateOps)

     if(req.file){
        updateOpsVal = {title: req.body.title, content: req.body.content, userPostID: req.userData.userId, postImage: req.file.path}

       // res.status(200).json('ok');
     }
     else{
        updateOpsVal = {title: req.body.title, content: req.body.content, userPostID: req.userData.userId}

        //res.status(200).json('no');
     }

    
    //Product.update( { _id: id } , { $set: {name: req.body.name, price: req.body.price} });
    Post
        //.update( { _id: id } , { $set: {title: req.body.title, content: req.body.content, postImage: req.file.path} })
        .update( { _id: id } , { $set: updateOpsVal })
        .exec()
        .then(doc =>{
            console.log(doc);
            res.status(200).json({"Post Update ":updateOpsVal});
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

