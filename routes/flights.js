const express = require('express') 
const router = express.Router() 
const {ensureAuth, ensureGuest} = require('../middleware/auth') 
const Flight = require('../models/Flight') 
const bodyParser = require("body-parser"); 
var alert = require('alert'); 
const session = require('express-session');  // session middleware 
const passport = require('passport');  // authentication 
const scraperCollectData = require ('../scraper/collectFlightData');
// const connectEnsureLogin = require('connect-ensure-login');// authorization 
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth'); 
const { ReadConcernLevel } = require('mongodb');
const {spawn} = require('child_process'); 
 
 
router.use(bodyParser.urlencoded({extended: true})); 
router.use(bodyParser.json()); 
 
 
router.get("/myFlights", ensureAuthenticated, async function(req, res){ 
    
    // console.log(req.user) 
    date = new Date(); 
    year = date.getFullYear(); 
    month = date.getMonth() + 1; 
    day = date.getDate(); 
    full = day + "/" + month + "/" + year  
     
    let all_flights = await Flight.find({}) 
    // console.log(all_flights) 
    console.log({full:full, items: all_flights, id: req.user._id}) 
    res.render('myFlights.ejs', {full:full, items: all_flights, id: req.user._id, userName: req.user.displayName}); 
    // databaseInfo.collection('notes').find({}).toArray((err, result)=>{ 
    //     // if(err) throw err 
    //     res.render('myFlights.ejs', {full:full, items: result, Email: currentEmail}); 
    // }) 
}) 
 
router.get("/addFlight", ensureAuthenticated,function(req, res){ 
    console.log(req.user.displayName)
    // console.log("get addflight ") 
<<<<<<< HEAD
    res.render('addFlight', {user: req.user}) 
=======
    res.render('addFlight.ejs', {userName: req.user.displayName}) 
>>>>>>> 55d5469ed9ef705fca4481bc5084b3e22707c3f5
}) 
 
// router.get("/addFlight",function(req, res){ 
//     console.log("get") 
//     res.render('addFlight.ejs') 
// }) 
 
router.post("/addFlight", async function(req, res){ 
    var dateFromUser = req.body.Date
    var year = dateFromUser.substr(0, 4)
    var month = dateFromUser.substr(5, 2)
    var day = dateFromUser.substr(8, 2)
    var parseDate = year+month+day
    console.log(parseDate)

    var flightNumFromUser = req.body.flightNumber
    flightNumFromUser = flightNumFromUser.replace(/\s/g, '');
    var partOneFlightNum = flightNumFromUser.substr(0, 2)
    var partTwoFlightNum = flightNumFromUser.substr(2, flightNumFromUser.length - 1)
    // console.log({partOne:partOne,partTwo:partTwo})
    // var fullInfo = scraperCollectData(partOneFlightNum,partTwoFlightNum,parseDate )
    var fullInfo = await scraperCollectData('LY EL AL ISRAEL AIRLINES', 'LY', '003', '20220615')
    console.log(fullInfo)
    // console.log(req.body) 
    // 'dep' : info[0],
    //     'dep_time' : info[1],
    //     'terminal' : info[2],
    //     'arv' : info[3],
    //     'arv_time' : info[4]
    // console.log({Departure: fullInfo.dep,
    //     DepartureTime: fullInfo.dep_time,
    //     Arrival: fullInfo.arv,
    //     ArrivalTime: fullInfo.arv_time,
    //     Terminal: fullInfo.terminal})
    let newFlight = new Flight({ 
        idUser: req.session.passport.user, 
        flightNumber: req.body.flightNumber, 
        Date: req.body.Date, 
        Departure: fullInfo.dep,
        DepartureTime: fullInfo.dep_time,
        Arrival: fullInfo.arv,
        ArrivalTime: fullInfo.arv_time,
        Terminal: fullInfo.terminal
    }); 
    newFlight.save(); 
    // console.log(req.session.name) 
    // var popup = require('popups'); 
 
    // popup.alert({ 
    //     content: 'Hello!' 
    // }); 
    // res.send({"Success":"added"}); 
<<<<<<< HEAD
    // alert("!הטיסה נוספה");
    res.redirect('/machine')  
    res.redirect('/addFlight') 
=======
    // alert("!הטיסה נוספה");  
    res.render('summaryFlight', { 
        num: req.body.flightNumber, 
        date: req.body.Date, 
        dep: fullInfo.dep,
        depTime: fullInfo.dep_time,
        arr: fullInfo.arv,
        arrTime: fullInfo.arv_time,
        terminal: fullInfo.terminal
    }) 
>>>>>>> 55d5469ed9ef705fca4481bc5084b3e22707c3f5
}) 
 
router.get("/summaryFlight",ensureAuthenticated, function(req, res){ 
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 
    res.render('summaryFlight.ejs' , req.params );
}) 

router.get("/report",ensureAuthenticated, function(req, res){ 
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 
    res.render('report.ejs' , req.params);
     
     
}) 
 
router.get("/Thankyou",ensureAuthenticated, function(req, res){ 
    // res.render('report.ejs', {Email: req.user._id}) 
    res.render('Thankyou.ejs') 
}) 

router.get('/machine',ensureAuthenticated, (req, res) => {
 
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['ModuleEval.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
    });
    
   })
 
module.exports = router