// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
var t
// URL of the page we want to scrape
const URL = 'https://www.flightview.com/TravelTools/FlightTrackerQueryResults.asp'
// Async function which scrapes the data
async function scrapeData(namal_input, al_input, fn_input, whenDate_input) {
  
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(URL, { params: {
        qtype : 'sfi',
        sfw : '/FV/FlightTracker/Main',
        whenArrDep: 'dep',
        namal: namal_input,
        al: al_input,
        fn: fn_input,
        whenDate: whenDate_input,
        input: 'Track Flight'
    }});

    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items
    const dep =  $('.search-results-table-data');

    info = []
    dep.each((idx, el) => {
        if ($(el).text() != '' && $(el).text() != '-') {
            info.push(($(el).text()).replace('\n', '')
            .replace('\n', '').replace('\n', '').split("<")[0].trim());
        }
    });

    full_d = {
        'dep' : info[0],
        'dep_time' : info[1],
        'terminal' : info[2],
        'arv' : info[3],
        'arv_time' : info[4]
    }
    console.log(full_d);
  } catch (err) {
    console.error(err);
  }
  return full_d
}
// Invoke the above function
// scrapeData('LY EL AL ISRAEL AIRLINES', 'LY', '003', '20220615')
module.exports = scrapeData