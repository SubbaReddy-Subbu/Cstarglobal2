const mongoose = require('mongoose');
const comments = require('./Comments')

const ArticleShema = new mongoose.Schema({
    ArticleName:{
        type:String,
        required : true
    },
    Description : {
        type : String,
        required : true
    },
    image : {
        type : String 
    },
    comments: { 
        type: Array, 
        default: [ {userName: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        }}] 
    }
})

module.exports = mongoose.model("Article",ArticleShema,"Articles")