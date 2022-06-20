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
var moment = require('moment');  
const { isMoment } = require('moment');

 
 
router.use(bodyParser.urlencoded({extended: true})); 
router.use(bodyParser.json()); 
router.use(bodyParser.text())
 
 
router.get("/myFlights", ensureAuthenticated, async function(req, res){ 
    
    console.log(req.user) 
    date=new Date(); 
    console.log(date.getFullYear()); 
    console.log(date.getMonth() + 1); 
    console.log(date.getDate()); 
    // fullDate = day + "/" + month + "/" + year  
    // console.log(fullDate) 
    let all_flights = await Flight.find({}) 
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!") 
    // console.log({fullDate:fullDate, items: all_flights, id: req.user._id}) 
    // res.render('myFlights.ejs', {fullDate:fullDate, items: all_flights, id: req.user._id, userName: req.user.displayName}); 
    console.log(req.user)
    
    res.render('myFlights.ejs', {items: all_flights, id: req.user._id, userName: req.user.userName, moment:moment}); 

    // databaseInfo.collection('notes').find({}).toArray((err, result)=>{ 
    //     // if(err) throw err 
    //     res.render('myFlights.ejs', {full:full, items: result, Email: currentEmail}); 
    // }) 
}) 
 
router.get("/addFlight", ensureAuthenticated,function(req, res){ 
    console.log(req.user)
    // console.log("get addflight ") 
    // res.render('addFlight', {user: req.user}) 
    res.render('addFlight.ejs', {userName: req.user.userName}) 
}) 
 
// router.get("/addFlight",function(req, res){ 
//     console.log("get") 
//     res.render('addFlight.ejs') 
// }) 
 
router.get("/deleteFlight",ensureAuthenticated,async function(req, res){
    console.log(req.user)
    date_flight=req.query.date
    num_flight=req.query.num
    console.log("delete")
    let all_flights = await Flight.find({}) 
    all_flights.forEach(flight =>{
        // console.log(flight.idUser)
        // console.log(req.user.id)
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
    // console.log({partOne:partOne,partTwo:partTwo})
    // var fullInfo = scraperCollectData(partOneFlightNum,partTwoFlightNum,parseDate )
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
    console.log(fullInfo)

    // No flight like this exisits 
    if (fullInfo == 0) {
        req.flash('error_msg', 'טיסה לא קיימת/ התאריך עבר');
        res.redirect("/addFlight")
    }
    
    var flight_data = [fullInfo.dep_date + ' ' + fullInfo.dep_time, al_input, fn_input, fullInfo.arv]
    console.log(flight_data)
    // let newFlight = new Flight({ 
    //     idUser: req.session.passport.user, 
    //     flightNumber: req.body.flightNumber, 
    //     Date: req.body.Date, 
    //     Departure: fullInfo.dep,
    //     DepartureTime: fullInfo.dep_time,
    //     Arrival: fullInfo.arv,
    //     ArrivalTime: fullInfo.arv_time,
    //     Terminal: fullInfo.terminal,
    // }); 
    // newFlight.save(); 
    // console.log(req.session.name) 
    // var popup = require('popups'); 
 
    // popup.alert({ 
    //     content: 'Hello!' 
    // }); 
    // res.send({"Success":"added"}); 
    // alert("!הטיסה נוספה");
    // res.redirect('/machine')  
    // res.redirect('/addFlight') 
    // alert("!הטיסה נוספה"); 
    
    var machine_pred;
    var r_date = fullInfo.dep_date.split('-')
    console.log(fullInfo.dep_date)
    console.log(r_date)
    console.log(r_date[2] + '-' + r_date[1] + '-' + r_date[0] + ' ' + fullInfo.dep_time)

    // spawn new child process to call the python script
    const python = spawn('python3', ['flight_machine/Flights_ML/ModuleEval.py', r_date[2] + '-' + r_date[1] + '-' + r_date[0] + ' ' + fullInfo.dep_time, al_input, fn_input, fullInfo.arv]);
    console.log('after spawn')
    
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        machine_pred = data.toString();
        console.log(machine_pred)
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
        
        console.log(machine_pred)
    });
    python.stderr.on('data', (data) => {
        console.error('err: ', data.toString());
    });
    
    python.on('exit', (code) => {
        // machine_pred = 'On time !'
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
    // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    //     res.render('summaryFlight', { 
    //         num: req.body.flightNumber, 
    //         date: req.body.Date, 
    //         dep: fullInfo.dep,
    //         depTime: fullInfo.dep_time,
    //         arr: fullInfo.arv,
    //         arrTime: fullInfo.arv_time,
    //         terminal: fullInfo.terminal,
    //         machinePred: machine_pred
    //     }) 
    // });

    // res.render('summaryFlight', { 
    //     num: req.body.flightNumber, 
    //     date: req.body.Date, 
    //     dep: fullInfo.dep,
    //     depTime: fullInfo.dep_time,
    //     arr: fullInfo.arv,
    //     arrTime: fullInfo.arv_time,
    //     terminal: fullInfo.terminal,
    //     machinePred: machine_pred
    // }) 
}) 
router.get("/flightDetails",ensureAuthenticated, function(req, res){ 
    console.log("summ")
    console.log(req.body)
    console.log(req.params)
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 
    res.render('flightDetails.ejs' , req.params );
}) 

router.get("/flightDetailsPast",ensureAuthenticated, function(req, res){ 
    console.log("summ")
    console.log(req.body)
    console.log(req.params.updateHour)
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 
    res.render('flightDetailsPast.ejs' , req.params );
}) 
 
router.get("/summaryFlights",ensureAuthenticated, function(req, res){ 
    console.log("summ")
    console.log(req.body)
    console.log(req.params)
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 
    res.render('summaryFlight.ejs' , req.params );
}) 

router.get("/board", function(req, res){ 
    
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 
    res.render('flightBoard.ejs');
}) 

router.get("/summaryFlight",async function(req, res)
{
    errors=[]
    console.log("INNNN")
    console.log(req.query.machine_pred)
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
    console.log(newFlight)
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
    // console.log(newFlight)
    res.redirect("/addFlight")
})
router.get("/report",ensureAuthenticated, function(req, res){ 
    // res.render('report.ejs', {Email: req.user._id}) 
    // res.render('report.ejs', {Email: "yeheli2421@gmail.com"}) 

    res.render('report.ejs',{email:req.user.Email ,params:req.params, url:process.env.URL});
     
     
}) 
 
router.get("/Thankyou",ensureAuthenticated, function(req, res){ 
    // res.render('report.ejs', {Email: req.user._id}) 
    res.render('Thankyou.ejs') 
}) 

router.post("/Plugin", function(req, res) { 
    res.header('Access-Control-Allow-Origin', '*');
    // res.render('report.ejs', {Email: req.user._id}) 
    console.log("*** inside server from PLUGIN ***")

    var datas = JSON.parse(req.body)
    console.log(datas.dayDept)
    console.log(datas.allFlightsOrigTime)
    console.log(datas.allFlightsName)

    // let options = {
    //     mode: 'text',
    //     pythonOptions: ['-u'], // get print results in real-time
    //       scriptPath: 'flight_machine/Flights_ML', //If you are having python_test.py script in same folder, then it's optional.
    //     args: [datas.dayDept, datas.allFlightsOrigTime, datas.allFlightsName, datas.allFlightsDestAirport2] //An argument which can be accessed in the script using sys.argv[1]
    // };
     
 
    // PythonShell.run('ModuleEvalPluginIn.py', options, function (err, result){
    //       if (err) throw err;
    //       // result is an array consisting of messages collected
    //       //during execution of script.
    //       console.log('result: ', result.toString());
    //       res.send(result.toString())
    // });
    const python = spawn('python3', ['flight_machine/Flights_ML/ModuleEvalPluginIn.py', datas.dayDept, datas.allFlightsOrigTime, datas.allFlightsName, datas.allFlightsDestAirport2]);
    console.log('after spawn FOR PLUGIN')
    
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script FOR PLUGIN ...');
        var m_tmp = data.toString();
        //m_tmp = m_tmp.split('[')[1].split(']')[0].split(', ')

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
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend)
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        // send data to browser
        res.send(dataToSend)
    });
})
 
module.exports = router