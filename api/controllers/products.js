const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all =  (req, res, next) =>{

    Product
    .find()
    .exec()
    .then(doc =>{
        console.log(doc);
        if(doc.length > 0){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message : "No entry found"});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });

    /*
    res.status(200).json({
        message: 'handling GET request to /products'
    });
    */
}

exports.products_get_post =   (req, res, next) =>{
    /*
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    */

    console.log(req.file);

    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: 'handling POST request to /products',
                createdProduct: result
            });            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });


}

exports.products_get_productID =  (req, res, nest) =>{
    const id= req.params.productID;

    Product
        .findById(id)
        .exec()
        .then(doc =>{
            console.log(doc);
            if(doc){
                res.status(200).json({"Form Database" : doc});
            }else{
                res.status(404).json({message : "No valid entry fund for provided ID"});
            }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
    /*
    if(id === 'special'){
        res
            .status(200)
            .json({
                message: 'INSERT',
                id: id
            })
    }
    else{
        res
            .status(200)
            .json({
                message: 'NOT INSERT',
                id: id
            })
    }
    */
}

exports.products_delete = (req, res, nest) =>{
    
    const id= req.params.productID;
    Product
        .remove({_id : id})
        .exec()
        .then(doc =>{
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });

    /*
    const id= req.params.productID;
    res
    .status(200)
    .json({
        message: 'DELETE',
        id: id
    })*/
}

exports.products_edit = (req, res, nest) =>{
    const id= req.params.productID;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    //Product.update( { _id: id } , { $set: {name: req.body.name, price: req.body.price} });
    Product
    .update( { _id: id } , { $set: updateOps })
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });

    /*
    res
    .status(200)
    .json({
        message: 'UPDATE',
        id: id
    })
    */
}
