const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});

// Create the model
module.exports = mongoose.model('Articles.comments', CommentsSchema, 'comments');

