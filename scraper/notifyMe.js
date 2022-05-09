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
 
async function updateEmail(flight){ 
    user = await User.find({_id:flight.idUser}) 
    email = user[0].Email
    // User.find({_id:flight.idUser}).forEach(user=>{userEmail = user.Email})
    client.setApiKey(process.env.SENDGRID_API_KEY) 
    client.send({ 
        to: { 
            email: email, 
            name: "YEHELI", 
        }, 
        from: { 
            email: process.env.EMAIL_SEND_FROM, 
            name:"Flight Prediction" 
        }, 
        templateId: process.env.TEMPLATE_ID, 
        dynamicTemplateData:{ 
            name: user.userName, 
            flightnum: flight.flightNumber, 
            from: flight.Departure,  
            to: flight.Arrival, 
            date: flight.delayDateUpdate, 
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
            var today = new Date(); 
            var dd = String(today.getDate()).padStart(2, '0'); 
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0! 
            var yyyy = today.getFullYear(); 
         
            today = yyyy + '-' + mm + '-' + dd; 
            // oldList = [] 
            // let difference = flights.result.records.filter(x => !oldList.includes(x)); 
            // console.log({difference: difference}) 
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
                 
            })
            //Flight.find( { delayDateUpdate: { $exists: true } } ) 
            let all_flights_first_delay = await Flight.find( { delayDateUpdate: { $exists: false } } ) 
            // console.log("all_flights:")    
            // console.log(all_flights)
            all_flights_first_delay.forEach(flight=>{ 
                delaysFlights.forEach(delayFlight=>{ 
                    // console.log({flight : flight, delayFlight: delayFlight}) 
                    if( flight.flightNumber == delayFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                        // console.log(flight.Email) 
                        
                        Flight.updateMany(
                            {flightNumber: delayFlight.flightNumber}, 
                            {delayDateUpdate : delayFlight.delayDate, delayHourUpdate : delayFlight.delayHour},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );
                        updateEmail(flight); 
                    } 
                }) 
            })
            let all_flights_multi_delay = await Flight.find( { delayDateUpdate: { $exists: true } } ) 
            // console.log("all_flights:")    
            // console.log(all_flights)
            all_flights_multi_delay.forEach(flight=>{ 
                delaysFlights.forEach(delayFlight=>{ 
                    // console.log({flight : flight, delayFlight: delayFlight}) 
                    if( flight.flightNumber == delayFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                        if (flight.delayDateUpdate != delayFlight.delayDate || flight.delayHourUpdate != delayFlight.delayHour){
                            var x = async() => {Flight.updateMany(
                                {flightNumber: delayFlight.flightNumber}, 
                                {delayDateUpdate : delayFlight.delayDate, delayHourUpdate : delayFlight.delayHour},
                                {multi:true}, 
                                function(err, numberAffected){}
                            );}
                            // updateEmail(flight); 
                        }
                        
                    } 
                }) 
            })
        } 
    }); 
} 
var loop = async () =>{ setInterval(notifyMe,15000) } 
module.exports = loop