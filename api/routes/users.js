const express = require('express');
const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try{
        const testEmail = await User.find({email: req.body.email});
        if(testEmail.length >= 1){
            res.json({message: "Email already exists"});
        }else{
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if(err){
                    res.json({error: err});
                }else{
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    })
                    const savedUser = await user.save();
                    res.json({message: "User created ...", user: user});
                }
            })
        }   
    }catch(err){
        res.json({error: err});
    }
})

router.delete('/:userId', async (req, res) => {
    try{
        const deletedUser = await User.deleteOne({_id: req.params.userId});
        res.json({message: "User deleted"});
    }catch(err){
        res.json({error: err});
    }
})

router.get('/signup', async (req, res) => {
    try{
        const get = await User.find();
        res.json(get);
    }catch(err){
        res.json({error: err});
    }
})

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email })
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {  
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                if(result){
                    const token = jwt.sign({email: user[0].email, userId: user[0]._id}, process.env.SCKEY, {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    })
                }
                res.status(401).json({
                    message: "Auth failed"
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})
    
    
module.exports = router;