var FileReader = require('filereader');
var fapi = require('file-api');
var File = fapi.File;

function mapAirlines() {
    var airline_codes_map = new Map();
    
    const fs = require('fs');
    // update path
    fs.readFile('scraper/names.csv', 'utf8', function(err, data) {
        if (err) throw err;
        var tmp = CSVToJSON(data);
        var tmp = JSON.parse(tmp);
        for (var t of tmp) {
            airline_codes_map.set(t.AL_CDA, t.AIRLINE);
        }
    });
    return airline_codes_map
}



function CSVToJSON(csvData) {
    var data = CSVToArray(csvData);
    var objData = [];
    for (var i = 1; i < data.length; i++) {
        objData[i - 1] = {};
        for (var k = 0; k < data[0].length && k < data[i].length; k++) {
            var key = data[0][k];
            objData[i - 1][key] = data[i][k]
        }
    }
    var jsonData = JSON.stringify(objData);
    jsonData = jsonData.replace(/},/g, "},\r\n");
    return jsonData;
}


function CSVToArray(csvData, delimiter) {
    delimiter = (delimiter || ",");
     var pattern = new RegExp((
    "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
    var data = [[]];
    var matches = null;
    while (matches = pattern.exec(csvData)) {
        var matchedDelimiter = matches[1];
        if (matchedDelimiter.length && (matchedDelimiter != delimiter)) {
            data.push([]);
        }
        if (matches[2]) {
            var matchedDelimiter = matches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            var matchedDelimiter = matches[3];
        }
        data[data.length - 1].push(matchedDelimiter);
    }
    return (data);
}

module.exports = mapAirlines