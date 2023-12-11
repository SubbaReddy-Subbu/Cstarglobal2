const mongoose = require('mongoose');
// const autoIncrement = require('mongoose'); // Correct import

// autoIncrement.initialize(mongoose.connection); // Initialize the plugin

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

// Apply the auto-increment plugin to the schema
// CommentsSchema.plugin(autoIncrement.plugin, 'CommentId');

// Create the model
module.exports = mongoose.model('Articles.comments', CommentsSchema, 'comments');

// var CounterSchema = Schema({
//     _id: {type: String, required: true},
//     seq: { type: Number, default: 0 }
// });
// var counter = mongoose.model('counter', CounterSchema);

var entitySchema = mongoose.Schema({
    testvalue: {type: String}
});

entitySchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.testvalue = counter.seq;
        next();
    });
});
