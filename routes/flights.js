const express = require('express') 
const router = express.Router() 
const Flight = require('../models/Flight') 
const bodyParser = require("body-parser"); 
const scraperCollectData = require ('../scraper/collectFlightData');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth'); 
const {spawn} = require('child_process'); 
var moment = require('moment');  
 
router.use(bodyParser.urlencoded({extended: true})); 
router.use(bodyParser.json()); 
router.use(bodyParser.text())
 
 
router.get("/myFlights", ensureAuthenticated, async function(req, res){ 
    
    date=new Date(); 
    let all_flights = await Flight.find({})
    res.render('myFlights.ejs', {items: all_flights, id: req.user._id, userName: req.user.userName, moment:moment}); 
}) 
 
router.get("/addFlight", ensureAuthenticated,function(req, res){ 
    res.render('addFlight.ejs', {userName: req.user.userName}) 
}) 
 
router.get("/deleteFlight",ensureAuthenticated,async function(req, res){
    date_flight=req.query.date
    num_flight=req.query.num
    let all_flights = await Flight.find({}) 
    all_flights.forEach(flight =>{
        if(flight.idUser == req.user.id){
            if (flight.flightNumber==num_flight && flight.Date==date_flight){
                flight.remove()
            }
        }
    })
    res.redirect("/myFlights")
})
router.post("/addFlight", async function(req, res){ 
    var dateFromUser = req.body.Date
    var flightNumFromUser = req.body.flightNumber
    flightNumFromUser = flightNumFromUser.replace(/\s/g, '');
    var al_input;
    var fn_input;
    if (flightNumFromUser.charAt(2) >= 'A') {
        var al_input = flightNumFromUser.substr(0, 3)
        var fn_input = flightNumFromUser.substr(3, flightNumFromUser.length - 1)
    } else {
        var al_input = flightNumFromUser.substr(0, 2)
        var fn_input = flightNumFromUser.substr(2, flightNumFromUser.length - 1)
    }
    var fullInfo = await scraperCollectData(al_input, fn_input, dateFromUser)

    // No flight like this exisits 
    if (fullInfo == 0) {
        req.flash('error_msg', 'טיסה לא קיימת/ התאריך עבר');
        res.redirect("/addFlight")
    }
    
    var flight_data = [fullInfo.dep_date + ' ' + fullInfo.dep_time, al_input, fn_input, fullInfo.arv]
    var machine_pred;
    var r_date = fullInfo.dep_date.split('-')
    // spawn new child process to call the python script
    const python = spawn('python3', ['flight_machine/Flights_ML/ModuleEval.py', r_date[2] + '-' + r_date[1] + '-' + r_date[0] + ' ' + fullInfo.dep_time, al_input, fn_input, fullInfo.arv]);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        machine_pred = data.toString();
        if (String(machine_pred).trim() == '3') {
            //document.getElementById('machinePred').style.backgroundColor = 'greenyellow' ;
            machine_pred = 'Severe delay'
        }
        if (String(machine_pred).trim() == '2') {
            //document.getElementById('machinePred').style.backgroundColor = '#ffff00' ;
            machine_pred = 'Moderate delay'
        }
        if (String(machine_pred).trim() == '1') {
            //document.getElementById('machinePred').style.backgroundColor = '#ffbf00' ;
            machine_pred = 'Minor delay'
        }
        if (String(machine_pred).trim() == '0') {
            //document.getElementById('machinePred').style.backgroundColor = 'ff4000' ;
            machine_pred = 'On time !'
        }
        
    });
    python.stderr.on('data', (data) => {
        console.error('err: ', data.toString());
    });
    
    python.on('exit', (code) => {
        console.log(code)
        res.render('summaryFlight', { 
            num: req.body.flightNumber, 
            date: req.body.Date, 
            dep: fullInfo.dep,
            depTime: fullInfo.dep_time,
            arr: fullInfo.arv,
            arrTime: fullInfo.arv_time,
            terminal: fullInfo.terminal,
            machinePred: machine_pred
        }) 
    });
  
}) 
router.get("/flightDetails",ensureAuthenticated, function(req, res){ 
    res.render('flightDetails.ejs' , req.query );
}) 

router.get("/flightDetailsPast",ensureAuthenticated, function(req, res){ 
    res.render('flightDetailsPast.ejs' , req.query );
}) 
 
router.get("/summaryFlights",ensureAuthenticated, function(req, res){ 
    res.render('summaryFlight.ejs' , req.params );
}) 

router.get("/board", function(req, res){ 
    
    res.render('flightBoard.ejs');
}) 

router.get("/summaryFlight",async function(req, res)
{
    errors=[]
    let newFlight = new Flight({ 
        idUser: req.session.passport.user, 
        flightNumber: full_d.num_flight, 
        Date: full_d.dep_date , 
        Departure: full_d.dep,
        DepartureTime: full_d.dep_time,
        Arrival: full_d.arv,
        ArrivalTime: full_d.arv_time,
        Terminal: full_d.terminal,
        MachinePred: req.query.machine_pred
    }); 
    exist=0
    let all_flights = await Flight.find({}) 
    all_flights.forEach(flight =>{
        if(flight.idUser == req.user._id){
            if (flight.flightNumber==full_d.num_flight && flight.Date==full_d.dep_date){
                exist=1
            }
        }
    })
    if (exist==0){
       newFlight.save();  
    }
    else{
        req.flash('error_msg', 'הטיסה כבר קיימת' );
    } 
    res.redirect("/addFlight")
})
router.get("/report",ensureAuthenticated, function(req, res){ 

    res.render('report.ejs',{email:req.user.Email ,query:req.query, url:process.env.URL});
     
     
}) 
 
router.get("/Thankyou",ensureAuthenticated, function(req, res){ 
    res.render('Thankyou.ejs') 
}) 

router.post("/Plugin", function(req, res) { 
    res.header('Access-Control-Allow-Origin', '*');

    var datas = JSON.parse(req.body)
    const python = spawn('python3', ['flight_machine/Flights_ML/ModuleEvalPluginIn.py', datas.dayDept, datas.allFlightsOrigTime, datas.allFlightsName, datas.allFlightsDestAirport2]);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        var m_tmp = data.toString();

        res.send(m_tmp)
    });
    python.stderr.on('data', (data) => {
        console.error('err: ', data.toString());
    });
      
    python.on('exit', (code) => {
        console.log(code)
    });
}) 


router.get('/machine',ensureAuthenticated, (req, res) => {
    var flight_info = 'flight-info'
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python3', ['flight_machine/Flights_ML/ModuleEval.py', flight_info]);
    // collect data from script
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        // send data to browser
        res.send(dataToSend)
    });
})
 
module.exports = router