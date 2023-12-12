const AuthController = require('../controlers/AuthController')
const ArticleController = require('../controlers/ArticleController')
const Article = require('../models/Article')

const express = require('express');
const router = express.Router();

const multer = require('multer');
const path =require ('path')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null , 'Uploads/');
    },
    filename : function (req,file , cb ) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req,file ,cb) =>{
    const allowedFileTypes = ["image/jpeg","image/jpg","image/png"];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true)
    } else {
        cb(null , false)
    }
}

let upload = multer({storage :storage  , fileFilter})


router.post("/login",AuthController.Login)
router.post("/register",AuthController.Register)
router.delete("/delete",AuthController.Authjwt,AuthController.Delete)
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        // Check if the file was uploaded successfully
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Access uploaded file details
        const ArticleImage = req.file.filename;

       } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/articles', async (req, res) => {
    const newArticle = req.body;
    const articleName = newArticle.ArticleName;
    const Description = newArticle.Description;
    const ArticleImage = req.body.ArticleImage; // Use req.body to access values from the form

    try {
        // Check if the article already exists
        const existingArticle = await Article.findOne({ ArticleName: articleName });
        console.log(existingArticle);
        if (existingArticle) {
            res.status(409).json({
                message: 'Article already exists',
                existingArticle,
            });
        } else {
            // If the article does not exist, save the new article
            const createdArticle = await Article.create({
                image: ArticleImage,
                ArticleName: articleName,
                Description: Description,
            });

            await createdArticle.save();
            res.status(201).json({
                message: 'Article created successfully',
                newArticle: createdArticle,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





router.post('/articles/:name/comments',AuthController.Authjwt,ArticleController.addcomments)
router.get('/articles',AuthController.Authjwt,ArticleController.getArticles )
router.get('/articles/:name',AuthController.Authjwt,ArticleController.getArticle);
router.get('/articles/:name/comments',AuthController.Authjwt,ArticleController.getComments)
router.delete('/articles/delete/:id',AuthController.Authjwt,ArticleController.deleteArticle)
router.delete('/articles/:name/delete/:index',AuthController.Authjwt,ArticleController.removeComment)

module.exports = router ;