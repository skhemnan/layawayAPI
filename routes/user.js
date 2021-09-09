// import express from 'express';
// import pool from '../db.js';
// import {verifyToken} from '../middleware/authorize.js'
const express = require('express')
const pool = require('../db.js')
const {verifyToken} = require('../middleware/authorize.js')

const router = express.Router();

router.get('/me', verifyToken , async (req, res) => {
	try {
		const {email} = req.body
		const users  = await pool.query('SELECT user_id, user_email, user_savings FROM users WHERE user_email = $1', [email])

  //	Verify Email Access
	let loggedEmail = req.cookies['email'].replace('%40','@')
	if(loggedEmail == "") return res.status(400).json({error: 'Please specify an email address you would like to use!'})
	if(email !== loggedEmail) return res.status(400).json({error: 'Unauthorized Access!'})

		res.json({message: `Hello again ${users.rows[0].user_email}`, user: users.rows})	
	} catch (error) {
		res.status(500).json({error: `ERROR_${error.message}`})	
	}
})

router.post('/savings', verifyToken, async(req, res) => {
	try {
		//Add money to savings	
		const {addition} = req.body

		// Amount validation
		let validAddition = /^\$?[0-9]+(\.[0-9][0-9])?$/.test(`${addition}`.replace(',',''))
		if(!validAddition) return res.status(401).json({error: 'Please enter a valid dollar amount for your addition!'})

		const id = req.cookies['id']
		// Verify ID
		if(id == "") return res.status(401).json({error: 'Unauthorized Access!'})

		const query = 'UPDATE users SET user_savings = user_savings + $1 WHERE user_id = $2 RETURNING *'
		const updateSavings = await pool.query(query, [addition, id])

		res.status(200).json({message: `Successfully added! Balance is now $${updateSavings.rows[0].user_savings}`})
	} catch (error) {
			res.status(400).json({error: `ERROR_${error.message}`})		
	}
})

//export default router;
module.exports = router;