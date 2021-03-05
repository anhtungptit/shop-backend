const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = async (req, res) => {
    try{
        const getOrder = await Order.find()
                                    .select('_id quantity product')
                                    .populate('product','_id name price');
        res.json({
            count: getOrder.length,
            orders: getOrder
        });
    }catch(err){
        res.json(err);
    }
}

exports.orders_get_specific = async (req, res) => {
    try{
        const specificOrder = await Order.findById(req.params.orderId)
                                        .select('quantity _id product')
                                        .populate('product','_id name price');
        if(!specificOrder){
            res.status(404).json({message: "order not found"});
        }
        res.json({order: specificOrder});
    }catch(err){
        res.json(err);
    }
}

exports.orders_create_order = async (req, res) => {  
    const order = new Order({ 
        product: req.body.productId,
        quantity: req.body.quantity
    })
    try{
        const findById = await Product.findById(req.body.productId);
        const postedOrder = await order.save();
        res.json({
            message: "Order was created",
            createdOrder: {
                _id: postedOrder._id,
                quantity: postedOrder.quantity,
                product: postedOrder.product
            }
        });
    }catch(err){
        res.json({message: "not found", err: err});
    }
}