const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    // customer_id: { 
    //     type: mongoose.Types.ObjectId,
    //     ref: "users",
    //     require: false
    // },
    product_id: { 
        type: mongoose.Types.ObjectId,
        ref: "products"
    },
    quantity: Number,
    totalPrice: Number,
})

module.exports = mongoose.model('Orders', orderSchema)
// module.exports = products
