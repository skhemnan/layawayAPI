const app = require('../../app')
const request = require('supertest')

describe('USER TEST - PROFILE', () => {

	let token = ''
	const email = 'saahil@layaway.com'

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

	it('Should make the request with an email in the cookie', async () => {
		let response = await request(app)
		.get('/user/me')
		.set('Cookie', [`email=`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			email: 'saahil@layaway.com'
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Please specify an email address you would like to use!')
	})	
	it('Should return token error if no token provided', async () => {
		let response = await request(app)
		.get('/user/me')
		.set('Cookie', [`email=${email}`])
		.send({
			email: 'saahil@layaway.com'
		})

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Please provide an access token!')

	})	
	it('Should return token error if invalid token provided', async () => {
		let response = await request(app)
		.get('/user/me')
		.set('Cookie', [`email=${email}`])
		.set('Authorization', `Bearer 32tjger0t834t2-fd`)
		.send({
			email: 'saahil@layaway.com'
		})

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Your token is invalid! Please check again')	
	})		
	it('Should return 400 error if incorrect user is trying to access', async () => {
		//
		let response = await request(app)
		.get('/user/me')
		.set('Cookie', [`email=${email.replace('@','%40')}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			email: 'daniel@layaway.com'
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('Unauthorized Access!')
	})	
	it('Should return 200 response with user information if correct information provided', async () => {


		let response = await request(app)
		.get('/user/me')
		.set('Cookie', [`email=${email.replace('@', '%40')}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			email: 'saahil@layaway.com'
		})

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('user')
	})	
})

describe('USER TEST - ADD TO SAVINGS', () => {

	let token = ''
	const id = '3c64fe2c-d01a-4c42-8a34-508a344195f5'
	const email = 'saahil@layaway.com'

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

	it('Should return 400 error if invalid dollar amount received in request', async () => {
		let response = await request(app)
		.post('/user/savings')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			"addition": "hello"
		})

		expect(response.status).toBe(401)
		expect(response.body.error).toBe('Please enter a valid dollar amount for your addition!')
	})

	it('Should return token error if no token provided', async () => {
		let response = await request(app)
		.post('/user/savings')
		.set('Cookie', [`id=${id}`])
		.send({
			"addition": "200"
		})

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Please provide an access token!')
	})	

	it('Should return token error if invalid token provided', async () => {
		let response = await request(app)
		.post('/user/savings')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer 32tjger0t834t2-fd`)
		.send({
			"addition": "200"
		})

		expect(response.status).toBe(403)
		expect(response.body.error).toBe('Your token is invalid! Please check again')	
	})	
	it('Should return 400 error if incorrect or no id is provided', async () => {
		let response = await request(app)
		.post('/user/savings')
		.set('Cookie', [`id=`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			"addition": "200"
		})

		expect(response.status).toBe(401)
		expect(response.body.error).toBe('Unauthorized Access!')
	})

	it('Should return 200 response with balance amount if correct information provided', async () => {
		let balanceReg = /(\$*[0-9])/

		let response = await request(app)
		.post('/user/savings')
		.set('Cookie', [`id=${id}`])
		.set('Authorization', `Bearer ${token}`)
		.send({
			"addition": "1"
		})

		expect(response.status).toBe(200)
		expect(response.body.message).toMatch(balanceReg)
	})	
})