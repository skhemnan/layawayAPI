const app = require('../app')
const request = require('supertest')

const getRequest = async (url) => {
	return await request(app).get(url)
}

const postRequest = async (url, data) => {
	return await request(app).post(url).send(data)
}

module.exports = {getRequest, postRequest}