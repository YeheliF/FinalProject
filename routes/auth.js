const express = require('express')
const passport = require('passport')
const router = express.Router()


// Auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))

// Google auth callback
router.get('/google/callback',function (req, res, next){ 
    passport.authenticate('google',{ 
        successRedirect : '/addFlight',
        failureRedirect : '/login' })
(req, res, next);})

// Logout user
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router


