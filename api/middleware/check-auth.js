const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SCKEY);
        next();
    }catch(err){
        res.json({message: "Auth failed", error: err});
    }   
}