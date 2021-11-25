const express = require('express');
const mongoose= require('mongoose');
const expressLayouts=require('express-ejs-layouts');
const Url=require('./model/urlmodel');
const urlrouter=require('./routes/url');
const path =require('path');

require('dotenv').config('./.env');

const dburi=process.env.URL;
const app = express();

app.set('view engine','ejs')
app.use(expressLayouts);
app.use('/css',express.static('public'));
app.set('views',path.join(__dirname,'/views'));
app.set('layout','./layouts/layout');
app.use(express.urlencoded({ extended: true })); 
mongoose.connect(dburi,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use(urlrouter);

app.listen(3000||process.env.PORT);