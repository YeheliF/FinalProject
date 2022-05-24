const {spawn} = require('child_process'); 

const allFlightsName = [];
const allFlightsOriginAirport = [];
const allFlightsDestAirport = [];
const allFlightsDestAirport2 = [];
const allFlightsDurations = [];
const allFlightsOriginTime = [];
const allFlightsDestTime = [];
const overNight = [];

var machine_pred; 

function sendToServer() {

    var dayDeparture = '2022-06-03'
    var allFlightsOriginTime = ['04:45', '04:50', '04:50', '05:00', '05:05', '05:05']
    var allFlightsName = ['KLM', 'EL AL', 'EL AL', 'EL AL', 'KLM', 'KLM']
    var allFlightsDestAirport2 = ['AMS', 'ZRH', 'BRU', 'LTN', 'WAW', 'LIS']

    const python = spawn('python3', ['flight_machine/Flights_ML/ModuleEvalPluginIn.py', dayDeparture, allFlightsOriginTime, allFlightsName, allFlightsDestAirport2]);
    console.log('after spawn')
    
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        var m_tmp = data.toString();
        m_tmp = m_tmp.split('[')[1].split(']')[0].split(', ')

        
        console.log(m_tmp)
    });
    python.stderr.on('data', (data) => {
        console.error('err: ', data.toString());
    });
      
    python.on('exit', (code) => {
        console.log(code)
        
    });

        // console.log(allFlightsDayDeparture.join('\n'))
        // console.log(allFlightsPlanes.join('\n'))
    // console.log(tryMe.join('\n'))
    // });
}

sendToServer()