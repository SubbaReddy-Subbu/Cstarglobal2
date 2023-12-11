const Article = require('../models/Article')

const addArticle = async (req, res) => {
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
}

const addcomments =async(req,res)=>{
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

}
const getArticles =async (req, res) => {
    try {
        const articles = await Article.find().exec();
        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}  

const getArticle = async (req,res)=>{
    const articleName = req.params.name;
    const article = await Article.findOne({ArticleName:  articleName});
       
    if(!article){
        res.status(404).json({message: "Article not found"})
    }
    res.status(200).json(article)


}
const deleteArticle = async(req,res)=>{
    const Article_Name = req.params.name
    const deletedArticle = await Article.findOneAndDelete({ArticleName:  Article_Name});
    res.status(200).json({message : "successfully deleted",
    deletedArticle})
}

const removeComment = async (req, res) => {
    const ArticleName = req.params.name;
    let index = req.params.index;

    try {
        const existingArticle = await Article.findOne({ ArticleName: ArticleName });

        if (existingArticle) {
            // Find the comment based on the provided index
            const commentToRemove = existingArticle.comments.find(comment => comment.index === index);

            if (commentToRemove) {
                // Remove the comment from the comments array
                existingArticle.comments = existingArticle.comments.filter(comment => comment.index !== index);

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
};

module.exports = {addArticle,addcomments,getArticles,getArticle,deleteArticle ,removeComment}