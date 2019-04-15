const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    content: { 
        type: String, 
        required: true
    },
    userPostID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    postImage: { type: String, required: true}
});
module.exports = mongoose.model('Post', postSchema );
