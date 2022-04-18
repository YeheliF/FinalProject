const express = require('express')
const passport = require('passport')
const router = express.Router()

// router.set("view engine","ejs");

// Auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile']}))

// Google auth callback
router.get('/google/callback', 
passport.authenticate('google',{ failureRedirect : '/' }),
(req,res) =>{
    console.log("רבחתה!")
    res.redirect('../../addFlight')
})

// Logout user
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router