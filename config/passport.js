const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User')
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(err, user)
      })
})


  passport.use(
    new LocalStrategy({ usernameField: 'Email',passwordField: 'Password' }, (Email, Password, done) => {
      // Match user
      User.findOne({
        Email: Email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'האימייל לא רשום' });
        }
        console.log(user)
        // Match password
        if(user.type == "google"){
          return done(null, false, { message: 'האימייל קיים בהתחברות דרך גוגל' });
        }
        bcrypt.compare(Password, user.Password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'סיסמא שגוייה' });
          }
        });
      });
    })
  );

  // passport.deserializeUser((id, done) => {
  //   googleUser.findById(id, (err, user) => done(err, user))

  // })

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  async (accessToken,refreshToken, profile,done) => {
      console.log(profile)
      const newUser = {
        unique_id: profile.id,
        userName: profile.displayName,
        Email:profile.emails[0].value,
        type:"google"
      }

      try {
          let user = await User.findOne({ unique_id: profile.id})
          if(user){
              done(null, user)
          } else{
              user= await User.create(newUser)
              done(null, user)
          }
      } catch (error) {
          console.error(err)
      }
  }))

  // passport.serializeUser((user, done) => {
  //     done(null, user.id)
  // })

   
}

