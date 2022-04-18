const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const googleUser = require('../models/UserGoogle')
const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User')
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

const addUser = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'Email' }, (email, password, done) => {
      console.log(email)
      // Match user
      User.findOne({
        Email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
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

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};


const addGoogleUser = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken,refreshToken, profile,done) => {
        console.log(profile)
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        try {
            let user = await googleUser.findOne({ googleId: profile.id})
            if(user){
                done(null, user)
            } else{
                user= await googleUser.create(newUser)
                done(null, user)
            }
        } catch (error) {
            console.error(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        googleUser.findById(id, (err, user) => done(err, user))
    })
}


module.exports = (passport) => {
    addUser(passport)
    addGoogleUser(passport)
}