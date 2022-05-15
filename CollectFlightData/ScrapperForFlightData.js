//const Flight = require('./blogs');
const jsdom = require('jsdom');
var $ = require("jquery");
var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);
const Mongoose = require('mongoose');

const Flight = Mongoose.model('Flight', new Mongoose.Schema({
    operatorNum: {
        type: String,
        required: true
    },
    flightNum: {
        type: String,
        required: true
    },
    operatorName: {
        type: String,
        required: true
    },
    scheduleTime: {
        type: String,
        required: true
    },
    actualTime: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    dst_city: {
        type: String,
        required: true
    },
    dst_country: {
        type: String,
        required: true
    },
    terminal: {
        type: String,
        required: true
    },
    cint: {
        type: String,
        required: true
    },
    ckzn: {
        type: String,
        required: true
    }
}, {timestamps : true}));

// connect to mongoDB
const DB_URI = 'mongodb+srv://ashi-98:ashi1998@cluster0.6dmrx.mongodb.net/flights?retryWrites=true&w=majority';
Mongoose.connect(DB_URI).then((result)=> {
    console.log("connected to db")}).catch((err)=> console.log(err));

function GetData(){
    console.log("got in notifyme")
    $.ajax({
        type: 'GET',
        url: 'https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=2400',
        success: async function(flights) {
            // oldList = []
            // let difference = flights.result.records.filter(x => !oldList.includes(x));
            // console.log({difference: difference})
            $.each(flights.result.records, function(i, flight) {
                
                // if departure
                if (flight.CHAORD == 'D' && flight.CHRMINE == 'DEPARTED') {
                    const query = {
                        operatorNum: flight.CHOPER,
                        flightNum: flight.CHFLTN,
                        scheduleTime: flight.CHSTOL
                    };
                    const update = {
                        operatorNum: flight.CHOPER,
                        flightNum: flight.CHFLTN,
                        operatorName: flight.CHOPERD,
                        scheduleTime: flight.CHSTOL,
                        actualTime: flight.CHPTOL,
                        destination: flight.CHLOC1,
                        dst_city: flight.CHLOC1T,
                        dst_country: flight.CHLOCCT,
                        terminal: flight.CHTERM,
                        cint: flight.CHCINT,
                        ckzn: flight.CHCKZN
                    };
                    const options = { upsert : true };
                    let doc = Flight.findOneAndUpdate(query, update, {
                        new: true,
                        upsert: true
                    }).then((result)=> {
                            console.log("saved")
                        }).catch((err) => {
                            conosole.log(err)
                        });
                    
                    // const f = new Flight({
                    //     id: index, time: flight.CHPTOL, body: 'body'
                    // });
                    // f.save().then((result)=> {
                    //     console.log("saved")
                    // }).catch((err) => {
                    //     conosole.log(err)
                    // });
                    // check if flight exsists
                    // if (index ) {
                    //     // if inside -> check if need to update
                    //     if (flight.CHPTOL != inside )
                    // }
                    // // if not -> add
                    // add ()
                }
               
            })
        }
    });
}
var loop = async () =>{ setInterval(GetData,900000) }
module.exports = loop
