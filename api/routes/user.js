const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


router.get('/userlist', (req, res, next)=>{

    User
        .find()
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

    


});

router.post('/signup', (req, res, next)=>{

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

    


});

router.post('/login', (req, res, next) =>{
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }else{

            bcrypt.compare(req.body.password, user[0].password,(err, result) =>{
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
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
})

router.delete('/:userId', (req, res, next) =>{
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
})

module.exports = router;