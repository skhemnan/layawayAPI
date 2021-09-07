import jwt from 'jsonwebtoken';

function authToken({user_id, user_email}) {
	const user = {user_id, user_email}
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
	return ({accessToken})
}

export {authToken};