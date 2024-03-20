const express = require('express')
const db = require('./models')
const cors = require('cors')
require('dotenv').config()




const app = express()


const auth = require('./routes/auth')
const clubs = require('./routes/clubs')



app.use(cors())
app.use(express.json())

app.use('/api/v1/auth', auth)
app.use('/api/v1/club', clubs)



//  alter: true
//{force: true}
db.sequelize.sync({alter: true}).then(() => {

    app.listen(3000, () => {
        console.log('Listening at http://localhost:3000')
    })
})