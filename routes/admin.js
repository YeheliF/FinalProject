// const express = require('express')
// const router = express.Router()
// const {ensureAuth, ensureGuest} = require('../middleware/auth')
// var alert = require('alert');
// const User = require('../models/User')
// const bodyParser = require("body-parser");

// // router.set("view engine","ejs");

// router.use(bodyParser.urlencoded({extended: true}));
// router.use(bodyParser.json());
// // var databaseInfo = result.db('flight')
// //Login
// // router.get('/', ensureGuest, (req,res) =>{
// //     res.render("login", {
// //         layout: 'login',
// //     })
// // })

// router.get('/', function (req, res, next) {
// 	return res.render('login');
// });

// router.get('/login', function (req, res, next) {
// 	return res.render('login');
// });

// // router.get("/login", function(req, res){
// //     return res.render('login.ejs')
// // })

// // router.post("/login", function(req, res){
// //     console.log("got in")
// //     newUser = new User({
// //         userName: req.body.userName,
// //         Email: req.body.Email,
// //         Password: req.body.Password
        

// //     });
// //     newUser.save();
// //     console.log("added")
// //     res.render('login')
// // })

// router.get("/signup", function(req, res){
//     console.log("new user")
//     res.render("signup.ejs")
// })

// // router.post("/signup", function(req, res){
// //     console.log("got in")
// // 	console.log(req.body)
// // 	// User.register()
// //     var newUser = new User({
// // 		unique_id:c,
// //         userName: req.body.userName,
// //         Email: req.body.Email,
// //         Password: req.body.Password
        

// //     });
// // 	// console.log(newUser)
// //     newUser.save();
// //     console.log("added")
// //     res.render('login')
// // })

// router.post("/signup", function(req, res, next) {
// 	console.log(req.body);
// 	console.log("error")

// 	var personInfo = req.body;
// 	console.log(personInfo.Email)
// 	console.log(personInfo.userName)
// 	console.log(personInfo.Password)
// 	console.log(personInfo.PasswordConf)
// 	if(!personInfo.Email || !personInfo.userName || !personInfo.Password || !personInfo.PasswordConf){
// 		res.send();
// 		console.log("errorrrrr")
// 	} else {
// 		console.log("in")
// 		if (personInfo.Password == personInfo.PasswordConf) {

// 			User.findOne({Email:personInfo.Email},function(err,data){
// 				if(!data){
// 					var c=0;
// 					User.findOne({},function(err,data){

// 						if (data) {
// 							console.log("if");
// 							c = data.unique_id + 1;
// 						}else{
// 							c=1;
// 						}

// 						var newPerson = new User({
// 							unique_id:c,
// 							userName: req.body.userName,
// 							Email: req.body.Email,
// 							Password: req.body.Password,
// 							PasswordConf: req.body.PasswordConf
// 						});

// 						newPerson.save(function(err, Person){
// 							if(err)
// 								console.log(err);
// 							else
// 								console.log('Success');
// 						});

// 					}).sort({_id: -1}).limit(1);
// 					// alert({"Success":"You are regestered,You can login now."});
// 					res.render('addFlight')
// 				}else{
// 					alert({"Success":"Email is already used."});
// 					res.render('signup')
// 				}

// 			});
// 		}else{
// 			alert({"Success":"password is not matched"});
// 			res.render('signup')
// 		}
// 	}
// });

// // router.get('/myFlights', ensureAuth, (req,res) =>{
// //     // console.log(req.user)
// //     res.render('myFlights.ejs')
// //     // name: req.user.firstName,
// // })

// // router.post("/login", function(req, res){
// //     console.log("got in")
// //     var flag = true;
// //     currentEmail = req.body.Email;
// //     currentPassword = req.body.Password;
// //     databaseInfo.collection('users').find({}).toArray((err, result)=>{
// //         // if(err) throw err
// //         result.forEach(user =>{
            
// //             if (currentEmail == user.Email && currentPassword == user.Password){
// //                 console.log('yes!')
// //                 currentUserName = user.userName;
// //                 res.redirect('/addFlight')
// //                 flag = false
// //             }


// //         })
// //         if(flag){
            
// //             var message = "wrong email or password" 
// //             console.log(message)
// //             // window.document.addEventListener("DOMContentLoaded", () => {
// //             //     const loginForm=window.document.querySelector("#login");
// //             //     loginForm.classList.add("form--hidden");
// //             // });
// //             // res.send(message) ;
// //             alert("אימייל או הסיסמא שגויים"); 
// //             res.redirect('/')
// //         }

// //     })
// // })

// router.post('/login', function (req, res, next) {
// 	console.log(req.body);
// 	User.findOne({Email:req.body.Email},function(err,data){
// 		if(data){
			
// 			if(data.Password==req.body.Password){
// 				//console.log("Done Login");
// 				req.session.userId = data.unique_id;
// 				console.log(req.session.userId);
// 				// res.send({"Success":"Success!"});
// 				// res.render('addFlight' ,{name:req.body.userName})
// 				res.redirect('/addFlight')
// 			}else{
// 				// res.alert({"Success":"Wrong password!"});
// 				res.redirect('/login')
// 			}
// 		}else{
// 			// res.alert({"Success":"This Email Is not regestered!"});
// 			res.redirect('/login')
// 		}
// 	});
// });


// module.exports = router


var express = require('express');
var router = express.Router();
// var User = require('../models/user');
// const express = require('express')
// const router = express.Router()
// const {ensureAuth, ensureGuest} = require('../middleware/auth')
var alert = require('alert');
const User = require('../models/User')
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication

// const connectEnsureLogin = require('connect-ensure-login');// authorization
const { forwardAuthenticated } = require('../config/auth');

// require('../config/passport')(passport)
// router.set("view engine","ejs");

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// passport.use(User.createStrategy());

// // To use with sessions
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


router.get('/signup',forwardAuthenticated, function (req, res, next) {
	return res.render('signup.ejs');
});


// router.post('/signup', function(req, res, next) {
// 	console.log(req.body);
// 	var personInfo = req.body;
// 	var errors = [];


// 	if(!personInfo.Email || !personInfo.userName || !personInfo.Password || !personInfo.PasswordConf){
// 		errors.push({ msg: 'Please enter all fields' });
// 		// res.redirect("/signup")
// 		// req.flash('לא מילאת את כל הפריטים')
// 		// res.send();
// 	} else {
// 		if (personInfo.Password == personInfo.PasswordConf) {

// 			User.findOne({Email:personInfo.Email},function(err,data){
// 				if(!data){
// 					var c;
// 					User.findOne({},function(err,data){

// 						if (data) {
// 							console.log("if");
// 							c = data.unique_id + 1;
// 						}else{
// 							c=1;
// 						}

// 						var newPerson = new User({
// 							unique_id:c,
// 							Email:personInfo.Email,
// 							userName: personInfo.userName,
// 							Password: personInfo.Password,
// 							PasswordConf: personInfo.PasswordConf
// 						});

// 						bcrypt.genSalt(10, (err, salt) => {
// 							bcrypt.hash(newPerson.Password, salt, (err, hash) => {
// 							  if (err) throw err;
// 							  newPerson.Password = hash;
// 							  newPerson
// 								.save()
// 								.then(user => {
// 								  req.flash(
// 									'success_msg',
// 									'You are now registered and can log in'
// 								  );
// 								//   res.redirect('/login');
// 								})
// 								.catch(err => console.log(err));
// 							});
// 						})
// 						// newPerson.save(function(err, Person){
// 						// 	if(err)
// 						// 		console.log(err);
// 						// 	else
// 						// 		console.log('Success');
// 						// });

// 					}).sort({_id: -1}).limit(1);
// 					// res.redirect("/login")
// 					// res.send({"Success":"You are regestered,You can login now."});
// 				}else{
// 					console.log("email exist")
// 					errors.push({ msg: 'Email is already used' });
// 					res.redirect("/signup")
// 					// res.send({"Success":"Email is already used."});
// 					// res.redirect("/signup")

// 				}

// 			});
// 		}else{
// 			errors.push({ msg: 'Passwords do not match' });
// 			// res.redirect("/signup")

// 			// res.send({"Success":"password is not matched"});
// 		}
// 	}
// 	console.log(errors)
// 	if(errors.length > 0){
// 		res.redirect("/signup")
// 	} else{
// 		res.redirect("/login")
// 	}
// });

router.post('/signup', (req, res) => {
	const { Email, userName, Password, PasswordConf } = req.body;
	let errors = [];
	let type="email"
	if (!userName || !Email || !Password || !PasswordConf) {
	  errors.push({ msg: 'Please enter all fields' });
	}
  
	if (Password != PasswordConf) {
	  errors.push({ msg: 'Passwords do not match' });
	}
  
	if (Password.length < 6) {
	  errors.push({ msg: 'Password must be at least 6 characters' });
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
		  errors.push({ msg: 'Email already exists' });
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
					console.log("if");
					c = data.unique_id + 1;
				}else{
					c=1;
				}
				const newUser = new User({
					c,
					Email,
					userName,
					type,
					Password,
					PasswordConf
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
						'You are now registered and can log in'
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
	console.log(req.body);
	passport.authenticate('local', {
		successRedirect: '/addFlight',
		failureRedirect: '/login',
		failureFlash: true
	  })(req, res, next);
	  console.log('successRedirect')
	// User.findOne({Email:req.body.Email},function(err,data){
	// 	console.log(data)
	// 	if(data){
			
	// 		if(data.Password==req.body.Password){
	// 			console.log("Done Login");
	// 			req.session.userId = data.unique_id;
	// 			// console.log(req.session.userId);
	// 			// res.send({"Success":"Success!"});
	// 			res.redirect('/addFlight')
				
	// 		}else{
	// 			res.redirect('/login')
	// 			console.log("Do");

	// 			// res.send({"Success":"Wrong password!"});
	// 		}
	// 	}else{
	// 		res.redirect('/login')
	// 		// res.send({"Success":"This Email Is not regestered!"});
	// 	}
	// });
});

// router.get('/profile', function (req, res, next) {
// 	console.log("profile");
// 	User.findOne({unique_id:req.session.userId},function(err,data){
// 		console.log("data");
// 		console.log(data);
// 		if(!data){
// 			res.redirect('/');
// 		}else{
// 			//console.log("found");
// 			return res.render('data.ejs', {"name":data.username,"email":data.email});
// 		}
// 	});
// });

router.get('/logout', function (req, res, next) {
	console.log("logout")
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/login');
	// if (req.session) {
    // // delete session object
    // req.session.destroy(function (err) {
    // 	if (err) {
    // 		return next(err);
    // 	} else {
	// 		req.logout();
    // 		return res.redirect('/');
    // 	}
    // });
// }
});

router.get('/forgetpass',forwardAuthenticated, function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			console.log('email not found');
			res.redirect('/forgetpass')
			// res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.redirect('/login')
					// res.send({"Success":"Password changed!"});
			});
		}else{
			res.redirect('/forgetpass')
			// res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

module.exports = router;