const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Flight = require('../models/Flight')
const bodyParser = require("body-parser");
var alert = require('alert');
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
// const connectEnsureLogin = require('connect-ensure-login');// authorization
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// router.get('/myFlights',ensureAuthenticated, (req,res) =>{
//     console.log(req.user)
//     res.render('myFlights.ejs',{user: req.user})
//     // name: req.user.firstName,
// })

router.get("/myFlights",ensureAuthenticated, async function(req, res){
    console.log(req.user)
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    full = day + "/" + month + "/" + year 
    
    // var collection=req.collection
    // console.log(collection)
    // Flight.collection.find({},function(err,data){
    //     console.log(data)
    // })
    let all_flights= await Flight.find({})
    console.log(all_flights)
    
    // databaseInfo.collection('notes').find({}).toArray((err, result)=>{
    //     // if(err) throw err
    res.render('myFlights.ejs', {full:full, items: all_flights, Email: req.user.googleId});
    // })
})

router.get("/addFlight", ensureAuthenticated,function(req, res){
    console.log("get addflight ")
    res.render('addFlight.ejs', {user: req.user})
})

// router.get("/addFlight",function(req, res){
//     console.log("get")
//     res.render('addFlight.ejs')
// })

router.post("/addFlight", function(req, res){
    
    console.log(req.session.passport.user)
    let newNote = new Flight({
        idUser: req.session.passport.user,
        flightNumber: req.body.flightNumber,
        Date: req.body.Date

    });
    newNote.save();
    console.log(req.session.googleId)
    // var popup = require('popups');

    // popup.alert({
    //     content: 'Hello!'
    // });
    // res.send({"Success":"added"});
    // alert("!הטיסה נוספה"); 
    res.redirect('/addFlight')
})


module.exports = router