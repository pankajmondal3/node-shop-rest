const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) =>{

    Order
        .find()
        .select('product quantity _id')
        .exec()
        .then(result =>{
            console.log(result);
            res.status(200).json({
                count: result.length,
                orders: result.map(doc =>{
                    return{
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'localhost:3000/orders'+ doc._id
                        }
                    }

                })              

            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error: err});
        });

    /*
    res.status(200).json({
        message: 'handling GET request to /orders'
    });
    */
}

exports.orders_create_order = (req, res, next) =>{
    /*
    const order = {
        productId : req.body.productId,
        quantity: req.body.quantity
    }
    */

    Product
        .findById(req.body.productId)
        .then(product =>{

            if(!product){
                return res.status(500).json({
                    message: "Product not found"                    
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
        
           return order.save(); 
        })
        .then(result =>{
            console.log(result);
            res.status(200).json({
                message: "Order store",
                createOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: 'localhost:3000/orders'+ result._id
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error: err});
        });           

    
}

exports.orders_get_order =  (req, res, nest) =>{
    //const id= req.params.orderID;


   Order
        .findById(req.params.orderID)            
        .then(result =>{

            if(!result){
                return res.status(500).json({
                    message: "Order not found"                    
                });
            }

            console.log(result);
            res.status(200).json({
                message: "Order found",
                order: result,
                request: {
                    type: "GET",
                    url: 'localhost:3000/orders'+ result._id
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error: err});
        }); 
}


exports.orders_delete_order =  (req, res, nest) =>{
    const id= req.params.orderID;

    Order
        .remove({ _id: id})
        .then(order =>{
            res
            .status(200)
            .json({
                message: 'Order DELETE',
                id: order.id
            })            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error: err});
        });

}
