// let client = require('@sendgrid/mail') 
// const nodemailer = require('nodemailer') 
// const MongoClient = require('mongodb').MongoClient 
const Flight = require('../models/Flight') 
 
// import * as $ from "jquery.js"; 
const jsdom = require('jsdom') 
const dom = new jsdom.JSDOM("") 
const jquery = require('jquery')(dom.window) 
var $ = require("jquery"); 
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow); 
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
$.support.cors = true; 
$.ajaxSettings.xhr = function () { 
 return new XMLHttpRequest; 
} 
 
function updateEmail(flight,delayFlight){ 
    client.setApiKey('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') 
 
    client.send({ 
        to: { 
            email: "yeheli2421@gmail.com", 
            name: "YEHELI", 
        }, 
        from: { 
            email: "yeheli2421@gmail.com", 
            name:"Flight Prediction" 
        }, 
        templateId: 'd-27a900d2aee84984a2212572732d2702', 
        dynamicTemplateData:{ 
            name: flight.idUser, 
            //name:, 
            flightnum: flight.flightNumber, 
            from: "HJK",  
            to:"KLO", 
            date: delayFlight.delayDate, 
            time: delayFlight.delayHour, 
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
                oldList = flights.result.records 
                if (flight.CHSTOL.includes(today)){ 
                    if (flight.CHRMINH == "עיכוב"){ 
                        // console.log(i + ' ' + JSON.stringify(flight)+'\n') 
                        delaysFlights.push({"flightNumber": flight.CHOPER+flight.CHFLTN, 
                                            "scheduledDate": flight.CHSTOL.substr(0, flight.CHSTOL.indexOf('T')), 
                                            "scheduledHour": flight.CHSTOL.substr(flight.CHSTOL.indexOf('T') + 1, flight.CHSTOL.length - 1), 
                                            "delayDate": flight.CHSTOL.substr(0, flight.CHPTOL.indexOf('T')), 
                                            "delayHour": flight.CHSTOL.substr(flight.CHPTOL.indexOf('T') + 1, flight.CHPTOL.length - 1),}) 
                    } 
                } 
                 
            }) 
            let all_flights = await Flight.find({}) 
                all_flights.forEach(flight=>{ 
                    delaysFlights.forEach(delayFlight=>{ 
                        // console.log({flight : flight, delayFlight: delayFlight}) 
                        if( flight.flightNumber == delayFlight.flightNumber){//} && note.Date.substr(0, note.Date.indexOf('T')) == delayFlight.scheduledDate){ 
                            // console.log(flight.Email) 
                            updateEmail(flight,delayFlight); 
                        } 
                    }) 
                }) 
             
        } 
    }); 
} 
var loop = async () =>{ setInterval(notifyMe,2000) } 
module.exports = loop