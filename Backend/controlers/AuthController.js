const User = require('../models/User');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const SecreteKey = process.env.SECRETEKEY

const Authjwt = async (req,res,next)=>{
    const token = req.header("Authorization");
    if(!token){
        return res.status(401).json({message : "Unauthorized"})
    }jwt.verify(token,SecreteKey,(err,user)=>{
        if(err){
            res.status(403).json({message : "invalid token"})
        }req.user = user;
        next()
    })
}

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            const verify = existingUser.password === password;

            if (verify) {
                const tokenUser ={name :  existingUser.userName }
                const accessToken = jwt.sign(tokenUser,SecreteKey);

                res.status(200).json({ message: `Welcome ${existingUser.userName}`,accessToken });
            } else {
                res.status(403).json({ message: "Incorrect details" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const Register = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            const newUser = await User.create({ userName, email, password });
            res.status(201).json({ message: `User ${userName} created successfully` });
            await newUser.save()
        } else {
            res.status(409).json({ message: "User already exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const Delete = async (req,res)=>{
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            const verify = existingUser.password === password;

            if (verify) {
                const deleted = User.findOneAndDelete({ email: email})
                res.status(200).json({ message: `deleted successfully ${deleted.userName}` });
            } else {
                res.status(403).json({ message: "Incorrect details" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { Login, Register,Delete,Authjwt };