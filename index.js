//import app from './app.js'
const app = require('./app')

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {`Server listening on ${PORT}`})