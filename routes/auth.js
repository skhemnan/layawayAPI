import express, { response } from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {authToken} from '../utils/authHelper.js'

const router = express.Router();

router.post('/login', async (req,res) => {
	try {
		const {email, password} = req.body;
		const query = 'SELECT * FROM users WHERE user_email = $1'
		const users = await pool.query(query, [email])	
		if(users.rows.length === 0) return res.status(400).json({error: 'User not found'})

		//PASSWORD
		const validPass = await bcrypt.compare(password, users.rows[0].user_password);
		if(!validPass) return res.status(401).json({error: 'Incorrect password! Please try again'})

		//JWT
		let token = authToken(users.rows[0]);
		res.cookie('accessToken', token.accessToken, {httpOnly: true});
		res.cookie('email', users.rows[0].user_email, {httpOnly: true})
		res.cookie('id', users.rows[0].user_id, {httpOnly: true})
		res.json({message: 'Login Succesful!', ...token});
		
	} catch (error) {
		res.status(401).json({error: `ERROR_${error.message}`})	
	}
})

router.post('/register', async (req,res) => {
	try {
		// Register User
		const {email, password, savings} = req.body;
		
		// Email validation
		let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!regEmail.test(email)) return res.status(401).json({error: 'Please enter a valid email address!'})

		// Amount validation
		let validSavings = /^\$?[0-9]+(\.[0-9][0-9])?$/.test(`${savings}`.replace(',',''))
		if(!validSavings) return res.status(401).json({error: 'Please enter a valid dollar amount for your savings!'})

		// Hash password
		const hash = await bcrypt.hash(password, 10);

		//Insert into db
		const query = 'INSERT INTO users (user_email, user_password, user_savings) VALUES ($1,$2,$3) RETURNING *'
		const newUser = await pool.query(query, [email, hash, savings])
		res.status(200).json({message: "User successfully registered!", users: newUser.rows[0]});
	} catch (error) {
		let errorObj = {}
		if(error.message.includes('duplicate key value')){
			errorObj = {error: "Email address already exists. Please try again."}
		} else {
			errorObj = {error: error.message}
		}
		res.status(401).json(errorObj)	
	}
})


router.delete('/logout', (req, res) => {
	try {
		res.clearCookie('accessToken');
		res.clearCookie('email');
		res.clearCookie('id');
		return res.status(200).json({message: 'User Logged Out!'})
	} catch (error) {
	  res.status(401).json({error: `ERROR_${error.message}`})		
	}
})

export default router;