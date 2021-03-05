const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + "-" + Date.now() + '.png');
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/img"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter});


router.get('/', async (req, res) => {
    try{
        const products = await Product.find().select("name price _id productImage");
        res.json(products);
    }catch(err) {
        res.json(err);
    }
})

router.get('/:productId', async (req, res) => {
    try{
        const product = await Product.findById(req.params.productId).select("name price _id productImage");
        res.json({product: product});
    }catch(err) {
        res.json(err);
    }
})

router.post('/', checkAuth, upload.single('productImage'), async (req, res) => {
    console.log(req.file);
    try{
        const product = new Product({
            name: req.body.name,
            price: req.body.price, 
            productImage: req.file.path
        })
        const savedProduct = await product.save();
        res.json(savedProduct);
    }catch(err) {
        res.json(err);
    }
})

router.patch('/:productId', checkAuth, async (req, res) => {
    try{
        const updateOps = {};
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
       const updatedProduct = await Product.updateOne({_id: req.params.productId}, {$set: updateOps});
       res.json(updatedProduct);
    }catch(err){
        res.json(err);
    }
})

router.delete("/:productId", checkAuth, async (req, res) => {
    try{
        const deletedProduct = await Product.deleteOne({_id: req.params.productId});
        res.json(deletedProduct);
    }catch(err){
        res.json(err);
    }
})

module.exports = router;