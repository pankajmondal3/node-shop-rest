const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.get_all_userlist =  (req, res, next)=> {
    User
        .find()
        .select('_id email name phone')
        .exec()
        .then(user =>{ 
            
            console.log(user);    
            if(user.length > 0){
                res.status(200).json({
                    message: "All Users List",
                    userDetails: user
                });  
            }else{
                //console.log(user);                   
                return res.status(422).json({
                    message: "Not found any user"
                });                 
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
}


exports.one_user_details_get =  (req, res, next)=> {
let id = req.params.userId

    User
        .findById(id)
        .select('_id email name phone')
        .exec()
        .then(user =>{ 
            
            //console.log(user);    
            if(!user){
                res.status(422).json({
                    message: "Not found user details"
                });  
            }else{
                res.status(200).json({
                    message: "User Details",
                    userDetails: user
                });  
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
}



exports.user_signup = (req, res, next)=>{

    User
        .find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length > 0){
                return res.status(422).json({
                    message: "Email Id already present",
                    Details: user
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            phone: req.body.phone
                        });    
                        
                        user
                            .save()
                            .then(doc =>{
                                console.log(doc);                   
                                res.status(200).json({
                                    message: "user created",
                                    userDetails: doc
                                });  
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({error: err});
                            });
                    }
                });
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });

    


} 


exports.user_login =  (req, res, next) =>{
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message:  'Auth failed',
                Error: 'Please provide a valid email ID'                
            });
        }else{

            bcrypt.compare(req.body.password, user[0].password,(err, result) =>{
                if(err){
                    return res.status(401).json({
                        message:  'Auth failed',
                        Error: 'Please provide a valid Password'  
                    });
                }

                if(result){
                    const token = jwt.sign({
                                            email: user[0].email,
                                            userId: user[0]._id
                                            }, 
                                            process.env.JWT_KEY,
                                            {
                                                expiresIn: "1h"
                                            }
                                        );
                    return res.status(200).json({
                        message: 'Auth Successfull',
                        token: token
                    });
                }

            })
        }

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
}


exports.user_delete =  (req, res, next) =>{
    User
        .remove({ _id: req.params.userId})
        .exec()
        .then(user =>{
            res.status(200).json({
                message: 'user deleted'
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.user_details_get =  (req, res, next)=> {
    let id = req.params.userId

    User
        .find({ _id: id})
        .select('_id email name phone')
        .exec()
        .then(user =>{ 
            
            console.log(user);    
            if(user.length > 0){
                res.status(200).json({
                    message: "User details",
                    userDetails: user
                });  
            }else{
                //console.log(user);                   
                return res.status(422).json({
                    message: "Not found User details"
                });                 
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.user_update =  (req, res, next)=> {
    let id = req.params.userId

    let {name, phone} = req.body

    User.findOneAndUpdate({_id: id}, {$set: {name,phone}},{new:true} )
        .then(userdata =>{
            res.status(200).json({
                message: "User update",
                userDetails: userdata
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });     


}
