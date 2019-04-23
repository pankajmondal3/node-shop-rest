const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user')

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
    .then(async doc =>{
        //console.log(doc);
        if(doc.length > 0){

            //Add User Details with Return Post Object
            let promises = doc.map(async p => {
                    
                let id = p.userPostID              

                let response = await User
                                        .find({ _id: id},{ _id: 0 })
                                        .select('email name phone')
                                        .exec()
                                        .then(user =>{ 
                                            
                                            console.log(user);    
                                            if(user.length > 0){
                                                return user  
                                            }else{
                                                return "Not found User details"
                                            }                        
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            return res.status(500).json({error: err});
                                        });                    

                return { ...p._doc, userDetails : response }
            })

            // wait until all promises resolve
            let results = await Promise.all(promises)

           //console.log(results);
            res.status(200).json(results);

            //res.status(200).json(doc);

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
        .then(async doc =>{
            
            if(doc){
                //console.log(doc._id);

                let id = doc.userPostID              

                let response = await User
                                        .find({ _id: id},{ _id: 0 })
                                        .select('email name phone')
                                        .exec()
                                        .then(user =>{ 
                                            
                                            console.log(user);    
                                            if(user.length > 0){
                                                return user  
                                            }else{
                                                return "Not found User details"
                                            }                        
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            return res.status(500).json({error: err});
                                        });



                // wait until all promises resolve
                let results = await Promise.all(response)

                //console.log(results);        
                res.status(200).json({"Single Post Details" : { ...doc._doc, results} });

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

