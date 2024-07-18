const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    product_image: {
        type: String,
    },
    product_name: { 
        type: String,
        require: true,
    },
    price: { 
        type: Number, 
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    }

})

module.exports = mongoose.model('Product', productSchema)
// module.exports = products
