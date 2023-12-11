const AuthController = require('../controlers/AuthController')
const ArticleController = require('../controlers/ArticleController')

const express = require('express');
const router = express.Router();

router.post("/login",AuthController.Login)
router.post("/register",AuthController.Register)
router.delete("/delete",AuthController.Authjwt,AuthController.Delete)

router.post('/articles',AuthController.Authjwt,ArticleController.addArticle ); 

router.post('/articles/:name/comments',AuthController.Authjwt,ArticleController.addcomments)
router.get('/articles',AuthController.Authjwt,ArticleController.getArticles )
router.get('/articles/:name',AuthController.Authjwt,ArticleController.getArticle)
router.delete('/articles/delete/:id',AuthController.Authjwt,ArticleController.deleteArticle)
router.delete('/articles/:name/delete/:index',AuthController.Authjwt,ArticleController.removeComment)

module.exports = router ;