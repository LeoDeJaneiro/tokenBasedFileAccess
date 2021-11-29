const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_HOST}/api/v1/auth/callback`,
    },
    function (_accessToken, refreshToken, profile, done) {
      return done(null, {
        email: profile._json.email,
        given_name: profile._json.given_name,
        picture: profile._json.picture,
        refreshToken,
      });
    }
  )
);
