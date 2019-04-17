const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ResetPassword = require('../models/resetPassword')
const crypto = require('crypto')
const moment = require('moment')
const changeCase = require('change-case')

// add this line before nodemailer.createTransport()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// create reusable transport method (opens pool of SMTP connections)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port:587,
    secure: false,
    auth: {
        user: 'pkmondal@aapnainfotech.com',
        pass: '@pankajmondal3'
    }
});

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

exports.user_reset_password =  (req, res, next)=> {
    let email = req.body.email
    console.log(email)
    User
        .find({email: email})
        /*.findOne({
            where: {email: email},//checking if the email address sent by client is present in the db(valid)
        })*/
        .then(user =>{
            //console.log(user)
            if (!user) {
                //return throwFailed(res, 'No user found with that email address.')
                return res.status(401).json({
                    message:  'Password Reset Error',
                    Error: 'No user found with that email address.'              
                });                
            }          

           // console.log('mmm :'+user)
           // console.log('kkk :'+user[0]._id)

            ResetPassword
                /*.findOne({
                    where: {userId: user.id, status: 0},
                })*/
                .findOne({userId: user[0]._id, status: 0})
                .then(resetPassword =>{

                    //Delete if before present STATUS:0 in Ccollection
                    if (resetPassword){
                       
                        ResetPassword
                            .deleteMany({userId: user[0]._id, status: 0})
                            .then()
                            .catch(err =>{
                                console.log(err);
                                return res.status(500).json({
                                    message:  'ResetPassword Remove Error',
                                    Error: err              
                                });  
                            })                            
                       
                        // resetPassword.destroy({
                        //     where: {
                        //         id: resetPassword.id
                        //     }
                        // })
                    }

                    token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
                    //bcrypt.hash(token, null, null, (err, hash) => {//hashing the password to store in the db node.js
                    bcrypt.hash(token, 10, (err, hash) =>{
    
                        if(err){
                            return res.status(500).json({
                                message:  'Password bcrypt Error',
                                Error: err              
                            });                        
                            
                        }else{                                 
                           
                           // console.log('ppp:'+user[0]._id)
                            /*
                            return res.status(200).json({
                                message:  'Password creat Error'        
                            });
                            */ 
    
                            const resetPasswordCreate = new ResetPassword({        
                                userId: user[0]._id,
                                resetPasswordToken: hash,
                                status: 0,
                                expire: moment.utc().add(2, 'minutes')
                                });                        
                            
                            resetPasswordCreate.save()
                            .then(item => {
                                if (!item){
                                    return res.status(401).json({
                                        message:  'Password creat Error',
                                        Error: 'Oops problem in creating new password record.'              
                                    });                              
                                }                            
                                    
                                let mailOptions = {
                                    from: '"Admin" pkmondal@aapnainfotech.com',
                                    to: user[0].email,
                                    cc: 'nmahato@aapnainfotech.in',
                                    subject: 'Reset your account password',
                                    html: '<p>Hi, <b>'+ changeCase.titleCase(user[0].name) +'</b></p>' +
                                    '<p>To reset your password, complete this form:</p>' +
                                    '<a href=' + process.env.CLIENT_URL + 'reset/' + user[0]._id + '/' + token + '">' + process.env.CLIENT_URL + 'reset/' + user[0]._id + '/' + token + '</a>' +
                                    '<br><br>' +
                                    '<p>--BLOG Team</p>'
                                }
        
                                //sending mail to the user where he can reset password.User id and the token 
                                //generated are sent as params in a link
                                transporter.sendMail(mailOptions,function(err,info){
                                    if(err){
                                        return res.status(401).json({
                                            message:  'Mail send Error',
                                            Error: 'Unable to send email.'+err              
                                        });  
                                    }else{
                                        //return res.json({success: true, message: 'Check your mail to reset your password.'})
        
                                        //  console.log('Email send:- '+ info.response);
                                        return res.status(200).json({
                                            message: 'Check your mail to reset your password.'                                    
                                        });                                
                                    }
        
                                })
        
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({error: err});
                            });    
                                        
    
                        }
                    })                     

                })
                .catch(err =>{
                    console.log(err);
                    return res.status(500).json({
                        message:  'Reset Password find Error',
                        Error: err              
                    });  
                })

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });          

}



exports.user_store_password = (req, res) =>{//handles the new password from react
    const userId = req.body.userId
    const token = req.body.token
    const password = req.body.password

    ResetPassword
        .findOne({ userId: userId ,status : 0 })
        .then(resetPassword => {

            //console.log(resetPassword)

            if (!resetPassword) {
                //return throwFailed(res, 'Invalid or expired reset token.')
                return res.status(401).json({
                    message:  'Token Error',
                    Error: 'Invalid or expired reset token.' +resetPassword             
                });                 
            }

            
            // the token and the hashed token in the db are verified befor updating the password
            bcrypt.compare(token, resetPassword.token, (errBcrypt, resBcrypt) =>{
                let expireTime = moment.utc(resetPassword.expire)
                let currentTime = new Date();

                //bcrypt.hash(password, null, null, (err, hash) => {
                bcrypt.hash(password, 10, (err, hash) =>{

                    if(err){
                        return res.status(500).json({
                            message:  'Password Store bcrypt Error',
                            Error: err              
                        });                        
                        
                    }else{                      
                        User
                        .findOneAndUpdate({_id: userId}, {$set: {password,hash}},{new:true} )
                        //.update({ password: hash,},{ where: { id: userId }})
                        .then(userdata => {

                            console.log(userdata)
                            console.log(userdata.email)

                            ResetPassword
                                .updateOne({_id: resetPassword._id },{ status: 1 })
                                .then(msg => {
                                    if(!msg) {
                                        return res.status(401).json({
                                            message:  'Error Password Update',
                                            Error: err              
                                        }); 
                                    }
                                    else {

                                        let mailOptions = {
                                            from: '"Admin" pkmondal@aapnainfotech.com',
                                            to: userdata.email,
                                            cc: 'nmahato@aapnainfotech.in',
                                            subject: 'Password Updated',
                                            html: '<p>Hi, <b>'+ changeCase.titleCase(userdata.name) +'</b></p>' +
                                            '<p>Password Updated successfully.</p>' +                                            
                                            '<br><br>' +
                                            '<p>--BLOG Team</p>'
                                        }
                
                                        //sending mail to the user where he can reset password.User id and the token 
                                        //generated are sent as params in a link
                                        transporter.sendMail(mailOptions,function(err,info){
                                            if(err){
                                                return res.status(401).json({
                                                    message:  'Mail send Error after Password update',
                                                    Error: 'Unable to send email after Password update.'+err              
                                                });  
                                            }else{
                                                //return res.json({success: true, message: 'Check your mail to reset your password.'})
                
                                                //  console.log('Email send:- '+ info.response);
                                                return res.status(200).json({
                                                    message: 'Password Updated successfully.'                                    
                                                });                                
                                            }
                
                                        })
   
                                    }                             
                                })
                                .catch(err =>{
                                    //console.log(err);
                                    return res.status(500).json({
                                        message:  'Password Updated successfully But ResetPassword Table Error',
                                        Error: err              
                                    });  
                                })                                   

                        })
                        .catch(err =>{
                            //console.log(err);
                            return res.status(500).json({
                                message:  'User Password Update Error',
                                Error: err              
                            });  
                        })                        

                    }

                })
            })

            
        })
        .catch(err =>{
            //.log(err);
            res.status(500).json({error: err});
        })
}