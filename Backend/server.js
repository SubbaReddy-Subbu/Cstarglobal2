const express = require('express');
const app = express()
const dotenv = require('dotenv');

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

app.use("/mern",login)

mongoose.connect(MONGO_URI)
    .then(
        console.log("Db has connected successfully")
    ).catch((err)=>{
        console.log({message:`server error ${err}`})
    })

// app.post('/articles', ); 

// app.post('/articles/:name/comments',)
// app.get('/articles', )
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
app.delete('/articles/delete/:name',async(req,res)=>{
    const Article_Name = req.params.name
    const existingArticle = await Article.findOneAndDelete({ArticleName:  Article_Name});
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