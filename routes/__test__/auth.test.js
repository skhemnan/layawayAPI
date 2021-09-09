// import app from '../../app'
// import supertest from 'supertest'
const app = require('../../app')
const request = require('supertest')

describe('AUTH TEST - LOGIN', () => {  

  it('Should return status 200 with accessToken and cookies set if all the info is correct', async () => {
    let email = 'saahil@layaway.com'

    const response = await request(app)
    .post('/auth/login')
    .send({
      "email": email,
      "password": "wishlist"
    });

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.headers['set-cookie'][0].split(';')[0].split('=')[1]).toEqual(response.body.accessToken)
    expect(response.headers['set-cookie'][1].split(';')[0].split('=')[1]).toEqual(email.replace('@','%40'))
    expect(response.headers['set-cookie'][2].split(';')[0].split('=')[1]).not.toEqual("")
  });

  it('Should return status 401 if incorrect or blank password is sent', async () => {
    const response = await request(app)
    .post('/auth/login')
    .send({
      "email": "saahil@layaway.com",
      "password": ""
    });

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Incorrect password! Please try again')
  })

  it('Should return status 401 if incorrect or blank email is sent', async () => {
    const response = await request(app)
    .post('/auth/login')
    .send({
      "email": "",
      "password": "wishlist"
    });

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User not found')
  }) 
 });


 describe('AUTH TEST - REGISTER', () => {  

  it('Should return invalid email address message if email field is incorrect', async () => {
    const response = await request(app)
    .post('/auth/register')
    .send({
      "email": "incorrectEmail",
      "password": "wishlist5",
      "savings": "200"
    });

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Please enter a valid email address!')
  });

  it('Should return invalid password message if password field is blank', async () => {
    const response = await request(app)
    .post('/auth/register')
    .send({
      "email": "test@layaway.com",
      "password": "",
      "savings": "200"
    });

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Please enter a password!')
  });
  it('Should return invalid savings message if savings field is incorrect', async () => {
    const response = await request(app)
    .post('/auth/register')
    .send({
      "email": "test@layaway.com",
      "password": "wishlist5",
      "savings": "200.5"
    });

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Please enter a valid dollar amount for your savings!') 
  });

  it('Should return email alrady exists if user tries to register with email that exists', async () => {
    const response = await request(app)
    .post('/auth/register')
    .send({
      "email": "saahil@layaway.com",
      "password": "wishlist5",
      "savings": "200"
    });

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Email address already exists. Please try again.')  
  });

  it('Should send a hashed version of the password', async () => {
    //
  });

  it('Should respond with 200 and User Registered message if all information is correct', async () => {
  //   const response = await request(app)
  //   .post('/auth/register')
  //   .send({
  //     "email": "incorrectEmail",
  //     "password": "wishlist5",
  //     "savings": "200"
  //   });

  //   expect(response.status).toBe(401)
  //   expect(response.body.error).toBe('Please enter a valid email address!')
  // });
 });
})

describe('AUTH TEST - LOGOUT', () => {  
  it('Should return 200 with all the cookies removed', async () => {
    const response = await request(app)
    .delete('/auth/logout')

    response.headers['set-cookie'].forEach(cookie => {
      let name = cookie.split(';')[0]
      expect(name.split('=')[1]).toEqual("")
    })
  });
});


