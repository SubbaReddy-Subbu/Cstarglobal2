const express = require('express');
const app = express()
const dotenv = require('dotenv');
const Article = require('./models/Article')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const login = require('./Router/Auth')

// const Article = require('./models/Article');
dotenv.config()
const MONGO_URI = process.env.MONGO_URI
const Port = 3002 ;
app.use(express())
app.use(express.json())
app.use(bodyParser.json())

app.use("/articles",login)

mongoose.connect(MONGO_URI)
    .then(
        console.log("Db has connected successfully")
    ).catch((err)=>{
        console.log({message:`server error ${err}`})
    })

app.post('/articles', async (req, res) => {
    const newArticle = req.body;
    const articleName = newArticle.ArticleName;
    const Description = newArticle.Description;
    const message = newArticle.Comments.message;
    const userName = newArticle.Comments.userName;

    try {
        // Check if the article already exists
        const existingArticle = await Article.findOne({ArticleName:  articleName});
        console.log(existingArticle)
        if (existingArticle) {
            res.status(409).json({
                message: "Article already exists",
                existingArticle 
            });
        } else {
            // If the article does not exist, save the new article
            const createdArticle = await Article.create({ ArticleName: articleName,Description :Description,  comments: [{userName : userName ,message : message}] });

            res.status(201).json({
                message: "Article created successfully",
                newArticle: createdArticle
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}); 

app.post('/articles/:name/comments',async(req,res)=>{
    const {userName , message } = req.body
    const ArticleName = req.params.name;
    try{
    const existingArticle = await Article.findOne({ArticleName:  ArticleName});
     if(existingArticle){

    existingArticle.comments.push({userName,message});
    await existingArticle.save();
    // console.log(articleInfo[ArticleName])
    res.status(200).json(existingArticle)
     }else {
        res.status(404).json({ message: "Article not found" });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}

})
app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find().exec();
        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.get('/articles/:name',async (req,res)=>{
    const articleName = req.params.name;
    const article = await Article.findOne({ArticleName:  articleName});
       
    if(!article){
        res.status(404).json({message: "Article not found"})
    }
    res.status(200).json(article)


})
app.get('/articles/:name/comments',async(req,res)=>{
    const ArticleName = req.params.name
    try{
    const existingArticle = await Article.findOne({ArticleName:  ArticleName});
     if(existingArticle){

    // existingArticle.comments.push({userName,message});
    // await existingArticle.save();
    // console.log(articleInfo[ArticleName])
    res.status(200).json(existingArticle.comments)
     }else {
        res.status(404).json({ message: "Article not found" });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}

})
app.delete('/articles/delete/:id',async(req,res)=>{
    const Article_id = req.params.id
    const existingArticle = await Article.findOneAndDelete({_id:  Article_id});
    res.status(200).json({message : "successfully deleted",
existingArticle})
})
app.delete('/articles/:name/delete/:index', async (req, res) => {
    const ArticleName = req.params.name;
    let index = req.params.index;

    try {
        const existingArticle = await Article.findOne({ ArticleName: ArticleName });

        if (existingArticle) {
            // Find the index of the comment in the comments array
            const commentIndex = existingArticle.comments.findIndex(comment => String(comment.index) === String(index));

            console.log(commentIndex);

            if (commentIndex !== -1) {
                // Remove the comment from the comments array
                existingArticle.comments.splice(commentIndex, 1);

                // Save the updated document
                await existingArticle.save();

                res.status(200).json(existingArticle);
            } else {
                // Handle the case where the comment with the specified index was not found
                res.status(404).json({ error: 'Comment not found' });
            }
        } else {
            res.status(404).json({ message: "Article not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




app.listen(Port,(req,res) =>{
    console.log(`server connected succesfully ${Port}`)
})