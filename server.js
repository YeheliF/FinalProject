const path = require('path');
const express = require ('express')
const mongoose = require('mongoose')
const dotenv = require ('dotenv')
const morgan = require ('morgan')
// const csrf = require('csurf');
// const exphbs = require('express-handlebars')
const passport = require ('passport')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require ('./config/db');
const scraperNotifyMe = require ('./scraper/notifyMe');
const scraperGetData = require ('./CollectFlightData/ScrapperForFlightData');
const nodeMailer = require('nodemailer');
const expressLayouts = require('express-ejs-layouts')
// const connectEnsureLogin = require('connect-ensure-login'); //authorization
const bodyParser = require("body-parser");
// const Auth0Strategy = require("passport-auth0");
////////////////?????????????????
require("dotenv").config();
// const { default: mongoose } = require('mongoose');


// load config
dotenv.config({path: './config/config.env'})

connectDB() 
scraperNotifyMe()
// scraperGetData()
const app = express()

// Passport config
require('./config/passport')(passport)

//login
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebars
// app.engine('.hbs', engine({extname: '.hbs'}));
// app.set('view engine', '.hbs');
app.use(expressLayouts)
app.set('view engine', 'ejs');

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cookieParser('SecretStringForCookies'))
//Session 
app.use(session({
    secret: 'secret',
    // cookie: {maxAge:  6000},
    resave:true,
    saveUninitialized:true,
    // cookie: { maxAge: 60 * 60 * 1000 },
    // store: MongoStore.create({ 
    //     mongoUrl: process.env.MONGO_URI
    // })
}))

// app.use(csrf());
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Connect flash
app.use(flash())

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// const session = {
//   secret: process.env.SESSION_SECRET,
//   cookie: {},
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ 
//       mongoUrl: process.env.MONGO_URI
//   })
// };

// if (app.get("env") === "production") {
//   // Serve secure cookies, requires HTTPS
//   session.cookie.secure = true;
// }



// app.use(express.urlencoded({ extended: false }));


// Routes
app.use('/', require('./routes/admin'))
app.use('/auth', require('./routes/auth'))
// app.use('/addFlight', require('./routes/flights'))
app.use('/', require('./routes/flights'))
// app.use(expressSession(session));




// const User = require('./models/User.js'); // User Model
// Passport Local Strategy
// passport.use(User.createStrategy());

// // To use with sessions
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());




// Static folder
app.use(express.static(path.join(__dirname, 'public')));

///////////////////////////////////////////////////////
// app.get('/success', (req, res) => res.send(userProfile));
// app.get('/error', (req, res) => res.send("error logging in"));


// app.get("/", function(req, res){
//     res.render(__dirname + "/views/login.ejs")
// })
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  // define as the last app.use callback
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });


const PORT = process.env.PORT || 80
app.listen(PORT)