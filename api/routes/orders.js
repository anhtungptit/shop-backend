const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.get('/:orderId', checkAuth, OrdersController.orders_get_specific);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.delete("/:orderId", checkAuth, async (req, res) => {
    try{
        const deletedOrder = await Order.deleteOne({_id: req.params.orderId});
        res.json({message: "Order deleted.."});
    }catch(err){
        res.json(err);
    }
})

module.exports = router;