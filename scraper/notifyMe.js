let client = require('@sendgrid/mail') 
// const nodemailer = require('nodemailer') 
// const MongoClient = require('mongodb').MongoClient 
const Flight = require('../models/Flight') 
const User = require('../models/User')
// import * as $ from "jquery.js"; 
const jsdom = require('jsdom') 
const dom = new jsdom.JSDOM("") 
const jquery = require('jquery')(dom.window) 
var $ = require("jquery"); 
const { use } = require('passport')
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow); 
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
$.support.cors = true; 
$.ajaxSettings.xhr = function () { 
 return new XMLHttpRequest; 
} 
 
async function updateEmail(flight,canceled){ 
    user = await User.find({_id:flight.idUser}) 
    userName = user[0].userName
    email = user[0].Email
    // userName = "ori"
    // email = "yeheli2421@gmail.com"
    client.setApiKey(process.env.SENDGRID_API_KEY);
    if(canceled = true){
        templateId = process.env.TEMPLATE_ID_CANCEL;
    } else {
        templateId = process.env.TEMPLATE_ID_DELAY;
    }
    client.send({ 
        to: { 
            email: email, 
            name: userName, 
        }, 
        from: { 
            email: process.env.EMAIL_SEND_FROM, 
            name:"Flight Prediction" 
        }, 
        templateId: templateId, 
        dynamicTemplateData:{ 
            name: user.userName, 
            flightnum: flight.flightNumber, 
            from: flight.Departure,  
            to: flight.Arrival, 
            date: flight.Date, 
            time: flight.delayHourUpdate, 
            // flightScheduledDetails: [user.flightNumber,user.from,user.to,user.date,user.hour], 
            // flightDelayDetails: [user.flightNumber,user.from,user.to,flight.delaydate,flight.delayHour] 
            // flightScheduledDetails: ["Flight Number: ", user.flightNumber, 
            //                         "\nDate: ", user.Date,], 
            // flightDelayDetails: ["Flight Number: ", user.flightNumber, 
            //                     "\nDate: ", flight.delayDate, 
            //                     "\nTime: ",flight.delayHour], 
        }, 
    }).then(() => { 
        console.log('Message sent') 
    }).catch((error) => { 
        console.log(error.response.body) 
        // console.log(error.response.body.errors[0].message) 
    }) 
} 
function notifyMe(){ 
    console.log("got in notifyme") 
    $.ajax({ 
        type: 'GET', 
        url: 'https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=2030', 
        success: async function(flights) { 
            var delaysFlights = [] 
            var canceledFlights = []
            var today = new Date(); 
            var dd = String(today.getDate()).padStart(2, '0'); 
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0! 
            var yyyy = today.getFullYear(); 
         
            today = yyyy + '-' + mm + '-' + dd; 
            $.each(flights.result.records, function(i, flight){ 
                // oldList = flights.result.records 
                if (flight.CHSTOL.includes(today)){ 
                    if (flight.CHRMINH == "עיכוב"){ 
                        // console.log(i + ' ' + JSON.stringify(flight)+'\n') 
                        delaysFlights.push({"flightNumber": flight.CHOPER+flight.CHFLTN, 
                                            "scheduledDate": flight.CHSTOL.substr(0, flight.CHSTOL.indexOf('T')), 
                                            "scheduledHour": flight.CHSTOL.substr(flight.CHSTOL.indexOf('T') + 1, 5), 
                                            "delayDate": flight.CHPTOL.substr(0, flight.CHPTOL.indexOf('T')), 
                                            "delayHour": flight.CHPTOL.substr(flight.CHPTOL.indexOf('T') + 1, 5)}) 
                    } 
                } 
                if (flight.CHSTOL.includes(today)){ 
                    if (flight.CHRMINH == "מבוטלת"){ 
                        // console.log(i + ' ' + JSON.stringify(flight)+'\n') 
                        canceledFlights.push({"flightNumber": flight.CHOPER+flight.CHFLTN, 
                                            "scheduledDate": flight.CHSTOL.substr(0, flight.CHSTOL.indexOf('T')), 
                                            "scheduledHour": flight.CHSTOL.substr(flight.CHSTOL.indexOf('T') + 1, 5)}) 
                    } 
                } 
                 
            })
            let all_flights_first_delay = await Flight.find( { delayHourUpdate: { $exists: false } } ) 
            // console.log("all_flights:")    
            // console.log(all_flights)
            all_flights_first_delay.forEach(flight=>{ 
                delaysFlights.forEach(delayFlight=>{ 
                    // console.log({flight : flight, delayFlight: delayFlight}) 
                    if( flight.flightNumber == delayFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                        // console.log(flight.Email) 
                        
                        var x = async() => {Flight.updateMany(
                            {flightNumber: delayFlight.flightNumber}, 
                            {delayHourUpdate : delayFlight.delayHour},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );}
                        updateEmail(flight,false); 
                    } 
                }) 
                canceledFlights.forEach(cancelFlight=>{ 
                    // console.log({flight : flight, delayFlight: delayFlight}) 
                    if( flight.flightNumber == cancelFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                        // console.log(flight.Email) 
                        
                        var x = async() => {Flight.updateMany(
                            {flightNumber: cancelFlight.flightNumber}, 
                            {delayHourUpdate : "התבטלה"},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );}
                        updateEmail(flight,true); 
                    } 
                }) 
            })
            let all_flights_multi_delay = await Flight.find( { delayHourUpdate: { $exists: true } } ) 
            // console.log("all_flights:")    
            // console.log(all_flights)
            all_flights_multi_delay.forEach(flight=>{ 
                delaysFlights.forEach(delayFlight=>{ 
                    // console.log({flight : flight, delayFlight: delayFlight}) 
                    if( flight.flightNumber == delayFlight.flightNumber){
                        if(flight.delayHourUpdate != "התבטלה"){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                            if (flight.delayHourUpdate != delayFlight.delayHour){
                                var x = async() => {Flight.updateMany(
                                    {flightNumber: delayFlight.flightNumber}, 
                                    {delayHourUpdate : delayFlight.delayHour},
                                    {multi:true}, 
                                    function(err, numberAffected){}
                                );}
                                updateEmail(flight,false); 
                            }
                        }
                        
                    } 
                }) 
                canceledFlights.forEach(cancelFlight=>{ 
                    // console.log({flight : flight, delayFlight: delayFlight}) 
                    if( flight.flightNumber == cancelFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                        // console.log(flight.Email) 
                        if(flight.delayHourUpdate != "התבטלה"){
                        var x = async() => {Flight.updateMany(
                            {flightNumber: cancelFlight.flightNumber}, 
                            {delayHourUpdate : "התבטלה"},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );}
                        updateEmail(flight,true); 
                        } 
                    }
                }) 
            })
            // let all_flights = await Flight.find( {} ) 
            // // console.log("all_flights:")    
            // // console.log(all_flights)
            // all_flights.forEach(flight=>{ 
            //     canceledFlights.forEach(cancelFlight=>{ 
            //         // console.log({flight : flight, delayFlight: delayFlight}) 
            //         if( flight.flightNumber == cancelFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
            //             // console.log(flight.Email) 
                        
            //             var x = async() => {Flight.updateMany(
            //                 {flightNumber: cancelFlight.flightNumber}, 
            //                 {cancelUpdate: true},
            //                 {multi:true}, 
            //                 function(err, numberAffected){}
            //             );}
            //             updateEmail(flight,true); 
            //         } 
            //     }) 
            // })
        } 
    }); 
} 
// var loop = async () =>{ setInterval(notifyMe,900000) } 
var loop = async () =>{ setInterval(notifyMe,2000) } 

module.exports = loop