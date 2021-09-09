// import express, {json} from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// ROUTES IMPORT
// import user from './routes/user.js'
// import auth from './routes/auth.js'
// import wishlist from './routes/wishlist.js'
const user = require('./routes/user.js')
const auth = require('./routes/auth.js')
const wishlist = require('./routes/wishlist.js')


dotenv.config()

const app = express()
const corsOptions = {credentials: true, origin: process.env.URL || '*'};

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

// ROUTES USE
app.use('/user', user);
app.use('/auth', auth);
app.use('/wishlist', wishlist);
app.get('/', (req, res) => {
	res.send("Welcome to Layaway!")
})


// export default app
module.exports = app