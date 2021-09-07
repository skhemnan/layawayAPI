import express from 'express';
import pool from '../db.js';
import {verifyToken} from '../middleware/authorize.js'

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
	try {
		//Add a product to wishlist	
		const {product, price} = req.body
		let id = req.cookies['id']

		// Price validation
		let validPrice = /^\$?[0-9]+(\.[0-9][0-9])?$/.test(`${price}`.replace(',',''))
		if(!validPrice) return res.status(401).json({error: 'Please enter a valid dollar amount for the product price!'})

		const query = 'INSERT INTO wishlists (user_id, product_name, product_price) VALUES ($1, $2, $3) RETURNING *'
		const productAddition = await pool.query(query, [id, product, price])

		res.status(200).json({message: `Success! Added product ${productAddition.rows[0].product_name}`})
	} catch (error) {		
		res.status(400).json({message: error.message})
	}
})

router.get('/', verifyToken, async (req, res) => {
	try {
		//Get the user info
		let email = req.cookies['email']
		let id = req.cookies['id']

		// Grab the user's savings to compare
		const userQuery = 'SELECT user_savings FROM users WHERE user_id = $1'
		const userSavingsQuery = await pool.query(userQuery, [id])
		const userSavings = userSavingsQuery.rows[0].user_savings

		// Grab the user's wishlist
		const wishlistQuery = 'SELECT * FROM wishlists WHERE user_id = $1'
		const userWishlist = await pool.query(wishlistQuery, [id])

		// Construct object
		let wishlistBreakdown = userWishlist.rows.map(product => {
			return {
				product: product.product_name,
				price: `${product.product_price}`,
				affordable: parseFloat(product.product_price) > parseFloat(userSavings) ? 'no' : 'yes',
				remaining_required: parseFloat(product.product_price) > parseFloat(userSavings) ? `$${parseFloat(product.product_price) - parseFloat(userSavings)}` : '$0'
			}
		})

		//Send completed object
		res.status(200).json({message: `Here is the wishlist for ${email}`, data: wishlistBreakdown})

	} catch (error) {		
		res.status(400).json({error: error.message})
	}
})


export default router;