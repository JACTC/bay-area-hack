const express = require('express')
const db = require('./models')
const cors = require('cors')
require('dotenv').config()




const app = express()


const auth = require('./routes/auth')
const clubs = require('./routes/clubs')
const user = require('./routes/user')

app.disable('x-powered-by');

app.use(cors())
app.use(express.json())

app.use('/api/v1/auth', auth)
app.use('/api/v1/club', clubs)
app.use('/api/v1/user', user)


//  alter: true
//{force: true}
db.sequelize.sync({alter: true}).then(() => {

    app.listen(process.env.port, () => {
        console.log('Listening at http://localhost:' + process.env.port)
    })
})