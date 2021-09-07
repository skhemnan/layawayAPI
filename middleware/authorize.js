import jwt from 'jsonwebtoken'

const verifyToken = (req,res,next) => {
	const header = req.headers['authorization']
	const token = header && header.split(' ')[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
		if(error) {
			let obj = {error: ''}
			if(error.message === 'jwt must be provided'){
				obj.error = 'Please provide an access token!'
			} else if(error.message === 'jwt malformed'){
				obj.error = 'Your token is invalid! Please check again'
			}
			return res.status(403).json(obj);
		}
		req.user = user;
		next()
	})
}

export {verifyToken};