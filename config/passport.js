const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const userModel = require("../models/userschema");


passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5200/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        let user = await userModel.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          await userModel.create({
            name: profile.displayName,
            googleId: profile.id,
            isGoogleLogin: true,
            email: profile.emails[0].value,
          });
          done(null, user);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
    console.log("deserializing user:", id);
  User.findById(id).then((user) => {
    done(null, user);
  });
});