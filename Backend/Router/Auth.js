const AuthController = require('../controlers/AuthController')

const express = require('express');
const router = express.Router();

router.post("/login",AuthController.Login)
router.post("/register",AuthController.Register)
router.delete("/delete",AuthController.Delete)

module.exports = router ;