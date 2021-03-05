const express= require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/uploads", express.static('uploads'));

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const { static } = require('express');
const userRoutes = require('./api/routes/users');

//connect to db
mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, () => {
    console.log("db connected....");
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);



app.listen(3000);