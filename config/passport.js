const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const googleUser = require('../models/UserGoogle')
const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User')
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    console.log(user.id)
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    c=0
    // var user
    User.findById(id, function(err, user){
      console.log(id)
      console.log(user)
      console.log(err)
      if(err){
        googleUser.findById(id, function(err, user){
          if(err){
            c=1
            console.log(c)
          } 
          else{
            console.log("google")
            done(err, user)
          }
        })
      }
      else{
        console.log("email")
        done(err, user)
      }
    })
    
    // if(c==2){
    //   done(err)
    // }
    // return done(null, user)
})


  passport.use(
    new LocalStrategy({ usernameField: 'Email',passwordField: 'Password' }, (Email, Password, done) => {
      // Match user
      User.findOne({
        Email: Email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        console.log(user)
        // Match password
        if(user.type == "google"){
          return done(null, false, { message: 'That email is exist' });
        }
        bcrypt.compare(Password, user.Password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  // passport.deserializeUser((id, done) => {
  //   googleUser.findById(id, (err, user) => done(err, user))

  // })

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
  },
  async (accessToken,refreshToken, profile,done) => {
      console.log(profile)
      const newUser = {
        unique_id: profile.id,
        userName: profile.displayName,
        Email:profile.emails[0].value,
        type:"google"
          // firstName: profile.name.givenName,
          // lastName: profile.name.familyName,
          // image: profile.photos[0].value
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

