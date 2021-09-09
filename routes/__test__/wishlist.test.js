const app = require('../../app')
const request = require('supertest');

describe('WISHLIST - ADD PRODUCT', () => {
	let token = ''
	const email = 'saahil@layaway.com'
	const id = '3c64fe2c-d01a-4c42-8a34-508a344195f5'

	beforeAll(async () => {
		//Log in and get token and cookies

		let response = await request(app).post('/auth/login').send({
			email: email,
			password: 'wishlist'
		})

		token = response.headers['set-cookie'][0].split(';')[0].split('=')[1]
	})

	afterAll(() => {
		//remove local variables
		token = ''
	})

	it('Should return 400 error if the price validation fails', async () => {
		//
		let response = await request(app)
		.post('/wishlist')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			product: 'iPhone',
			price: 'iphoneprice'
		})

		expect(response.status).toBe(401)
		expect(response.body.error).toBe('Please enter a valid dollar amount for the product price!')
	})
	it('Should return 400 error if the product name is empty', async () => {
		//
		let response = await request(app)
		.post('/wishlist')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			product: '',
			price: '700'
		})

		expect(response.status).toBe(401)
		expect(response.body.error).toBe('Please enter a product name!')
	})
	it('Should return 400 error if the id is missing or invalid', async () => {
		//
		let response = await request(app)
		.post('/wishlist')
		.set('Cookie', [`id=`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			product: 'iPhone',
			price: '700'
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Unauthorized Access!')

	})
	it('Should return 403 erorr for empty token', async () => {
		//
		let response = await request(app)
		.post('/wishlist')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer`)
		.send({
			product: 'iPhone',
			price: '700'
		})

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Please provide an access token!')
	})
	it('Should return 403 error for invalid token', async () => {
		//
		let response = await request(app)
		.post('/wishlist')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer fasfhw2fh923f`)
		.send({
			product: 'iPhone',
			price: '700'
		})

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Your token is invalid! Please check again')
	})
	it('Should return 200 with message including product name if correct information is provided', async () => {
		//
		let product = 'iPhone'
		let response = await request(app)
		.post('/wishlist')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			product: product,
			price: '700'
		})

		expect(response.status).toBe(200)
		expect(response.body.message).toContain(product)
	})
});

describe('WISHLIST - GET WISHLIST', () => {
	let token = ''
	const email = 'saahil@layaway.com'
	const id = '3c64fe2c-d01a-4c42-8a34-508a344195f5'

	beforeAll(async () => {
		//Log in and get token and cookies

		let response = await request(app).post('/auth/login').send({
			email: email,
			password: 'wishlist'
		})

		token = response.headers['set-cookie'][0].split(';')[0].split('=')[1]
	})

	afterAll(() => {
		//remove local variables
		token = ''
	})

	it('Should return 400 error if the id is missing or invalid', async () => {
		//
		let response = await request(app)
		.get('/wishlist')
		.set('Cookie', [`id=;email=${email}`])
		.set('Authorization', `Bearer ${token}`)
		.send()

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Unauthorized Access!')
	})
	it('Should return 400 error if the email is missing or invalid', async () => {
		//
		let response = await request(app)
		.get('/wishlist')
		.set('Cookie', [`id=${id};email=`])
		.set('Authorization', `Bearer ${token}`)
		.send()

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Unauthorized Access!')
	})
	it('Should return 403 erorr for invalid token', async () => {
		//
		let response = await request(app)
		.get('/wishlist')
		.set('Cookie', [`id=${id};email=${email}`])
		.set('Authorization', `Bearer`)
		.send()

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Please provide an access token!')
	})
	it('Should return 403 error for empty token', async () => {
		//
		let response = await request(app)
		.get('/wishlist')
		.set('Cookie', [`id=${id};email=${email}`])
		.set('Authorization', `Bearer 2efjowief28dsf0`)
		.send()

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Your token is invalid! Please check again')
	})
	it('Should return 200 with message including all the variables if correct information is provided', async () => {
	//
	let response = await request(app)
		.get('/wishlist')
		.set('Cookie', [`id=${id};email=${email}`])
		.set('Authorization', `Bearer ${token}`)
		.send()

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('data')
		response.body.data.forEach(product => {
			expect(product).toHaveProperty('price')
			expect(product).toHaveProperty('affordable')
			expect(product).toHaveProperty('remaining_required')
		})
	})

});