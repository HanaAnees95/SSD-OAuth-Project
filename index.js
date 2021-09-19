const express = require('express')
const homePage = require('./routes/homePage')
const mainPage = require('./routes/mainPage')
const passportConfig = require('./configs/passport')
const passport = require('passport')
const cookieSession = require('cookie-session')
const AUTHKEYS = require('./configs/AuthKeys')
const nunjucks = require('nunjucks')
const fileUpload = require('express-fileupload')


let app = express()
const port = 4000 || process.env.PORT
app.listen(port, () => console.log(`server is running on ${port}`))


nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.use('/static', express.static('public'))

var path = __dirname + '/views/'; 

app.use(cookieSession({
    keys: [AUTHKEYS.session_key]
}))


app.use(passport.initialize())
app.use(passport.session())


app.use(fileUpload());


app.use('', homePage) 
app.use('/auth', mainPage) 
