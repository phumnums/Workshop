const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
    quantity: { 
        type: Number,
        require: true,
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
})

module.exports = mongoose.model('ordersItems', orderItemSchema)
// module.exports = products
