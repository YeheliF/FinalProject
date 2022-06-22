let client = require('@sendgrid/mail') 
const Flight = require('../models/Flight') 
const User = require('../models/User')
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow); 
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
$.support.cors = true; 
$.ajaxSettings.xhr = function () { 
 return new XMLHttpRequest; 
} 
 
//send email to client about delay OR cancled flight
async function updateEmail(flight,canceled){ 
    
    user = await User.find({_id:flight.idUser}) 
    userName = user[0].userName
    email = user[0].Email
    client.setApiKey(process.env.SENDGRID_API_KEY);
    if(canceled){
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
            name: userName, 
            flightnum: flight.flightNumber, 
            from: flight.Departure,  
            to: flight.Arrival, 
            date: flight.Date, 
            hour: '02:49',
        }, 
    }).then(() => { 
        console.log('Message sent') 
    }).catch((error) => { 
        console.log(error.response.body) 
    }) 
} 

// go over all db and check for update in flights day and time
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
                if (flight.CHSTOL.includes(today)){ 
                    if (flight.CHRMINH == "עיכוב"){ 
                        delaysFlights.push({"flightNumber": flight.CHOPER+flight.CHFLTN, 
                                            "scheduledDate": flight.CHSTOL.substr(0, flight.CHSTOL.indexOf('T')), 
                                            "scheduledHour": flight.CHSTOL.substr(flight.CHSTOL.indexOf('T') + 1, 5), 
                                            "delayDate": flight.CHPTOL.substr(0, flight.CHPTOL.indexOf('T')), 
                                            "delayHour": flight.CHPTOL.substr(flight.CHPTOL.indexOf('T') + 1, 5)}) 
                    } 
                } 
                if (flight.CHSTOL.includes(today)){ 
                    if (flight.CHRMINH == "מבוטלת"){ 
                        canceledFlights.push({"flightNumber": flight.CHOPER+flight.CHFLTN, 
                                            "scheduledDate": flight.CHSTOL.substr(0, flight.CHSTOL.indexOf('T')), 
                                            "scheduledHour": flight.CHSTOL.substr(flight.CHSTOL.indexOf('T') + 1, 5)}) 
                    } 
                } 
                 
            })
            let all_flights_first_delay = await Flight.find( { delayHourUpdate: { $exists: false } } ) 
            all_flights_first_delay.forEach(flight=>{ 
                delaysFlights.forEach(async delayFlight=>{ 
                    if( flight.flightNumber == delayFlight.flightNumber){                        
                        await Flight.updateMany(
                            {flightNumber: delayFlight.flightNumber}, 
                            {delayHourUpdate : delayFlight.delayHour},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );
                        updateEmail(flight,false); 
                    } 
                }) 
                canceledFlights.forEach(async cancelFlight=>{ 
                    if( flight.flightNumber == cancelFlight.flightNumber){                        
                        await Flight.updateMany(
                            {flightNumber: cancelFlight.flightNumber}, 
                            {delayHourUpdate : "התבטלה"},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );
                        updateEmail(flight,true); 
                    } 
                }) 
            })
            
            let all_flights_multi_delay = await Flight.find( { delayHourUpdate: { $exists: true, $ne: "התבטלה" } } ) 
            all_flights_multi_delay.forEach(flight=>{ 
                delaysFlights.forEach(async delayFlight=>{ 
                    if( flight.flightNumber == delayFlight.flightNumber){
                        
                        if (flight.delayHourUpdate != delayFlight.delayHour){
                            await Flight.updateMany(
                                {flightNumber: delayFlight.flightNumber}, 
                                {delayHourUpdate : delayFlight.delayHour},
                                {multi:true}, 
                                function(err, numberAffected){}
                            );
                            updateEmail(flight,false); 
                        }
                        
                        
                    } 
                }) 
                canceledFlights.forEach(async cancelFlight=>{ 
                    if( flight.flightNumber == cancelFlight.flightNumber){
                        await Flight.updateMany(
                            {flightNumber: cancelFlight.flightNumber}, 
                            {delayHourUpdate : "התבטלה"},
                            {multi:true}, 
                            function(err, numberAffected){}
                        );
                        updateEmail(flight,true); 
                        
                    }
                }) 
            })
        } 
    }); 
} 
var loop = async () =>{ setInterval(notifyMe,900000) } 
// var loop = async () =>{ setInterval(notifyMe,20000) } 

module.exports = loop