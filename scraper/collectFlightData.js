const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const mapAirlines = require("./constants");

// CONSTANT VARIABLES 

// URL of the page we want to scrape
const URL = 'https://www.flightview.com/TravelTools/FlightTrackerQueryResults.asp'
const AIRLINE_MAP = mapAirlines()
const D_MONTHS = new Map([
  ['Jan', '01'], ['Feb', '02'], ['Mar', '03'], ['Apr', '04'],
  ['May', '05'], ['Jun', '06'], ['Jul', '07'], ['Aug', '08'],
  ['Sep', '09'], ['Oct', '10'], ['Nov', '11'], ['Dec','12']
])
const TIMES = new Map([
  ['1', '13'], ['2', '14'], ['3', '15'], ['4', '16'], ['5', '17'], ['6', '18'],
  ['7', '19'], ['8', '20'], ['9', '21'], ['10', '22'], ['11', '23'], ['12', '12']
])

// Async function which scrapes the data
async function scrapeData(airline, flightNum, dateFromUser) {
  var year = dateFromUser.substr(0, 4)
  var month = dateFromUser.substr(5, 2)
  var day = dateFromUser.substr(8, 2)
  var whenDate_input = year + month + day
  var al_input = airline;
  var fn_input = flightNum;
  if (al_input === 'EJU' || al_input === 'EZY') {
    al_input = 'U2'
  }
  console.log(al_input)
  var namal_input = AIRLINE_MAP.get(al_input)

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

    var info = []
    dep.each((idx, el) => {
      console.log($(el).text());
      if ($(el).text() != '' && $(el).text() != '-') {
        info.push(($(el).text()).replace('\n', '')
          .replace('\n', '').replace('\n', '').split("<")[0].trim());
        }
    });
    console.log(info)
    if (info.length == 0) {
      return 0
    }

    // format departure date  
    var dep_str_time = info[1].split(',')[0]
    var dep_time = dep_str_time.split(' ')[0]
    var dep_am_or_pm = dep_str_time.split(' ')[1]
    if (dep_am_or_pm == 'PM') {
      dep_time = TIMES.get(dep_time.split(':')[0]) + ':' + dep_time.split(':')[1]
    } else {
      if (dep_time.split(':')[0] == '12') {
        dep_time = '00:' + dep_time.split(':')[1]
      }
    }
    var dep_str_date = info[1].split(',')[1]
    var dep_d = year + '-' + D_MONTHS.get(dep_str_date.substr(1, 4).trim()) + '-' + dep_str_date.substr(4, dep_str_date.length - 1).trim()
    
    
    // format arrival date
    var arv_str_time = info[4].split(',')[0]
    var arv_time = arv_str_time.split(' ')[0]
    var arv_am_or_pm = arv_str_time.split(' ')[1]
    if (arv_am_or_pm == 'PM') {
      arv_time = TIMES.get(arv_time.split(':')[0]) + ':' + arv_time.split(':')[1]
    } else {
      if (arv_time.split(':')[0] == '12') {
        arv_time = '00:' + arv_time.split(':')[1]
      }
    }
    var arv_str_date = info[4].split(',')[1]
    var arv_d = year + '-' + D_MONTHS.get(arv_str_date.substr(1, 4).trim()) + '-' + arv_str_date.substr(4, arv_str_date.length - 1).trim()
    
    
    full_d = {
        'num_flight': airline + flightNum,
        'dep' : info[0],
        'dep_time' : dep_time,
        'dep_date' : dep_d,
        'terminal' : info[2],
        'arv' : info[3],
        'arv_time' : arv_time,
        'arv_date' : arv_d
    }

    console.log(full_d);
  } catch (err) {
    console.error(err);
    return 0;
  }
  return full_d
}

module.exports = scrapeData