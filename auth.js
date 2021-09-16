const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; process.env.GOOGLE_CLIENT_ID,
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;   process.env.GOOGLE_CLIENT_SECRET,
const GOOGLE_CLIENT_ID = '306873896254-guod6t20jr65i6r13a47g3dsrfgobnn4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '3TdRiwx-5bl1k_J301NocG3P';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
