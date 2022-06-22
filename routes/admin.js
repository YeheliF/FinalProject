var express = require('express');
var router = express.Router();
const User = require('../models/User')
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const passport = require('passport');  // authentication
const { forwardAuthenticated } = require('../config/auth');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
// const { token } = require('morgan');
// const { config } = require('dotenv');
// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
// const session = require('express-session');  // session middleware
// var alert = require('alert');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/signup',forwardAuthenticated, function (req, res, next) {
	return res.render('signup.ejs');
});


router.post('/signup', (req, res) => {
	const { Email, userName, Password, PasswordConf } = req.body;
	let errors = [];
	let type="email"
	if (!userName || !Email || !Password || !PasswordConf) {
	  errors.push({ msg: 'מלא/י את כל השדות' });
	}
  
	if (Password != PasswordConf) {
	  errors.push({ msg: 'הסיסמאות לא תואמות' });
	}
  
	if (Password.length < 6) {
	  errors.push({ msg: 'הסיסמא צריכה להכיל לפחות 6 תווים' });
	}
	
	if (errors.length > 0) {
	  res.render('signup', {
		errors,
		Email,
		userName,
		type,
		Password,
		PasswordConf
	  });
	} else {
		User.findOne({Email:Email},function(err,data){
		if (data) {
		  errors.push({ msg: 'האימייל כבר קיים' });
		  res.render('signup', {
			errors,
			Email,
			userName,
			type,
			Password,
			PasswordConf
		  });
		} else {
			var c;
			User.findOne({},function(err,data){

				if (data) {
					c = data.unique_id + 1;
				}else{
					c=1;
				}
				const newUser = new User({
					c,
					Email,
					userName,
					type,
					Password
					// PasswordConf
				});
	
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.Password, salt, (err, hash) => {
				if (err) throw err;
				newUser.Password = hash;
				newUser
					.save()
					.then(user => {
					req.flash(
						'success_msg',
						'נרשמת בהצלחה'
					);
					res.redirect('/login');
					})
					.catch(err => console.log(err));
				});
			});
			})
		}
	  });
	}
  });

router.get('/',forwardAuthenticated, function (req, res, next) {
	return res.render('login.ejs');
});

router.get('/login',forwardAuthenticated, function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	passport.authenticate('local', {
		successRedirect: '/addFlight',
		failureRedirect: '/login',
		failureFlash: true
	  })(req, res, next);
});


router.get('/logout', function (req, res, next) {
	req.logout();
	req.flash('success_msg', 'התנתקת');
	res.redirect('/login');
});

router.get('/forgetpass',forwardAuthenticated, function (req, res, next) {
	res.render("forget.ejs");
});


router.post('/forgetpass', async (req, res) => {
    const email  = req.body.Email;
    // not checking if the field is empty or not 
    // check if a user existss with this email
    var userData = await User.findOne({ Email: email });
    if (userData) {
        if (userData.type == 'google') {
            // type is for bootstrap alert types
            req.flash('error_msg', 'האימייל מחובר דרך gmail- לא ניתן לשנות סיסמא' );
			res.redirect('/forgetpass');
        } else {
			res.render('sendMailREset.ejs',{email:email, id:" לחץ על הקישור לשנות סיסמא: "+ process.env.RESET_URL+userData.id});
		}
    } else {
        req.flash('error_msg', 'אימייל לא נכון' );
		res.redirect('/forgetpass');

    }
	router.get('/resetPassword',forwardAuthenticated, function (req, res, next) {
		var userData = User.findOne({ resetLink: req.query });
		res.render('resetPassword.ejs', {token:req.query.token});
	});

	router.post('/resetPassword', async  function (req, res, next) {
		let errors = [];
		var userData=await User.findOne({_id:req.body.id});
		if(!userData){
			errors.push({ msg: 'אימייל לא קיים' })
			res.redirect('/resetPassword')
			
		}else{
			
			if (req.body.Password==req.body.PasswordConf) {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(req.body.Password, salt, (err, hash) => {
					if (err) throw err;
					userData.Password = hash;
					// userData.PasswordConf=req.body.PasswordConf;
				
					userData.save()
					.then(user => {
					req.flash(
						'success_msg',
						'הסיסמא שונתה בהצלחה :)'
					);
					res.redirect('/login');
					})
					.catch(err => console.log(err));
					})	
				});
			
			}else{
				res.redirect('/forgetpass')
			}
		}
		
	});


});

module.exports = router;