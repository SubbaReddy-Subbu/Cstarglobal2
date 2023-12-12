const express = require('express');
const app = express()
const dotenv = require('dotenv');
const ejs = require('ejs');
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


app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');


app.get('/', async (req, res) => {
    await res.render('Article', { title: 'Articles' });
});

mongoose.connect(MONGO_URI)
    .then(
        console.log("Db has connected successfully")
    ).catch((err)=>{
        console.log({message:`server error ${err}`})
    })


app.get('/',(req,res)=>{
    res.send("deta has fetched")
})

app.listen(Port,(req,res) =>{
    console.log(`server connected succesfully ${Port}`)
})