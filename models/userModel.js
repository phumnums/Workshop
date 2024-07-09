const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    
    username: { 
        type: String, 
        require: true, 
        unique: true 
    },
    password: { 
        type: String, 
        require: true, 
    },
    role: {
        type: String,
        default: 'user',
    },
    approved: {
        type: Boolean,
        default: false
    }

})

const user = mongoose.model('user', userSchema)
module.exports = user