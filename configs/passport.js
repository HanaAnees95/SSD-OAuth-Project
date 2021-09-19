const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const AUTHKEYS = require('./AuthKeys')

// The functions sets cookie details using the user
passport.serializeUser((user, done) => {

    let sessionUser = {
        _id: user.googleID,
        accessToken: user.accesstoken,
        name: user.name,
        pic_url: user.pic_url,
        email: user.email
    }

    done(null, sessionUser)
})


// use  deserialize to getcookie session data
passport.deserializeUser((sessionUser, done) => {

    done(null, sessionUser) 
})


assport.use(
    
    new GoogleStrategy(
        // google  authkeys
        {
            clientID: AUTHKEYS.googleOauth.clientID,
            clientSecret: AUTHKEYS.googleOauth.clientSecret,
            callbackURL: AUTHKEYS.googleOauth.callback,
            passReqToCallback: true

        }, (request, accessToken, refreshToken, profile, done) => {

            //saving the data in the session
            user = {
                "accesstoken": accessToken,
                'googleID': profile.id,
                'name': profile.displayName,                
                'email': profile._json.email
            }

            done(null, user)
        }
    )
)