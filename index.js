import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// ROUTES
import user from './routes/user.js'
import auth from './routes/auth.js'
import wishlist from './routes/wishlist.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const corsOptions = {credentials: true, origin: process.env.URL || '*'};


// MIDDLEWARE
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser())

app.use('/user', user);
app.use('/auth', auth);
app.use('/wishlist', wishlist);
//app.use('/', (req, res) => {res.send("Welcome to Layaway!")});


app.listen(PORT, () => {`Server listening on ${PORT}`})