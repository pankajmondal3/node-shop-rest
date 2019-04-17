const mongoose = require('mongoose');
const resetPasswordSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true         
    },
    resetPasswordToken: { 
        type: String
    },
    status :{
        type: Number, default:0
    },
    expire: { type: String}
});
module.exports = mongoose.model('ResetPassword', resetPasswordSchema );
