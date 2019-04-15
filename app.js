const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const postRoutes = require('./api/routes/post');

mongoose.connect('mongodb+srv://pankaj:'+ process.env.MONGO_ATLAS_PW +'@mongo-node-c9vw2.mongodb.net/node-mongoose?retryWrites=true', { useNewUrlParser: true });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH, DELETE,GET');
        return res.status(200).json({});
    }
    next();
});
/*
app.use((req,res,next) =>{
    res.status(200).json({
        message: 'Its work!'
    });
});*/
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use((req, res, next) =>{
    const error = new Error('Page Not found ');
    error.status = 404;
    next(error);
});
app.use( (error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        message:  error.message
    })
});

module.exports = app;
