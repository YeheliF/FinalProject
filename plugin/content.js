const allFlightsName = [];
const allFlightsOriginAirport = [];
const allFlightsDestAirport = [];
const allFlightsDestAirport2 = [];
const allFlightsDurations = [];
const allFlightsOriginTime = [];
const allFlightsDestTime = [];
const overNight = [];
var txtMachinePred = [];


const dayDeparture = window.location.href.split('/')[5]

var machine_pred = []; 

// send data to server from KAYAK website in order to get machine prediction 
function sendToServer() {
    const paragraphs = document.getElementsByClassName("resultWrapper");
    for (flight of paragraphs) {
        flightName = flight.getElementsByClassName('codeshares-airline-names')[0];
        origin = flight.getElementsByClassName("airport-name")[0];
        destination = flight.getElementsByClassName("airport-name")[1];
        duration = flight.getElementsByClassName("section duration allow-multi-modal-icons")[0].getElementsByClassName("top")[0];
        originTime = flight.getElementsByClassName("depart-time base-time")[0];
        destTime = flight.getElementsByClassName("arrival-time base-time")[0];
        oneway = flight.getElementsByClassName("container")[0];
        if (oneway.getElementsByClassName("adendum")[0] != null) {
            overNight.push(1);
        } else {
            overNight.push(0);
        }
        allFlightsName.push(flightName.innerHTML);
        allFlightsOriginAirport.push(origin.innerHTML);
        allFlightsDestAirport.push(destination.innerHTML);
        allFlightsDestAirport2.push(destination.innerHTML.substring(1,4));
        allFlightsDurations.push(duration.innerHTML);
        allFlightsOriginTime.push(originTime.innerHTML);
        allFlightsDestTime.push(destTime.innerHTML);
    }

    console.log(allFlightsName.join('\n'));
    console.log(allFlightsOriginAirport.join('\n'));
    console.log(allFlightsDestAirport.join('\n'));
    console.log(allFlightsDurations.join('\n'));
    console.log(allFlightsOriginTime.join('\n'));
    console.log(allFlightsDestTime.join('\n'));
    console.log(overNight.join('\n'));

    var data={'dayDept' : dayDeparture, 'allFlightsOrigTime' : allFlightsOriginTime, 'allFlightsName' : allFlightsName, 'allFlightsDestAirport2' : allFlightsDestAirport2};
    console.log("******CONNECTING SERVER******")
    var xhttp = new XMLHttpRequest();

    // set callback for when connection with prefernces server is ready
    xhttp.onreadystatechange = function () {
        console.log("readystate", this.readyState)
        console.log("status: ", this.status)
        if (this.readyState == 4 && this.status == 200) {
            console.log("finished connecting server")

            // reorder sections acoording to the server response
            var preds = this.responseText
            console.log(`response text: ${preds}`)

            machine_pred = preds.split('[')[1].split(']')[0].split(', ')
            // order = sections_order.preferences

            console.log(machine_pred)
            CreatElements()

        } else {
            machine_pred = []
            var l = allFlightsOriginTime.length
            for (let j = 0; j < l; j++) {
                machine_pred.push('5')
            }
        }
        
    }

    url = "http://localhost:80/Plugin"
    xhttp.open("POST", url);

    // send Get request
    xhttp.send(JSON.stringify(data))
    console.log(" send finished ")
}


// creat button and machine prediction elements on the KAYAK website
function CreatElements() {
    const slides = document.getElementsByClassName('top-row');
    $(document).ready(function () {
        setTimeout(function(){
            var j = 0;
            for (var i = 0; i < slides.length; i = i+2) {
                console.log("in loop")
                const flightPercent = document.createElement('div');
                var txt;
                var clr;
                if (machine_pred[j] == '0') {
                    txt = 'On time !'
                    clr = 'greenyellow'
                } 
                if (machine_pred[j] == '1') {
                    txt = 'Minor delay'
                    clr = 'yellow'
                } 
                if (machine_pred[j] == '2') {
                    txt = 'Moderate delay'
                    clr = 'orange'
                } 
                if (machine_pred[j] == '3') {
                    txt = 'Severe delay'
                    clr = 'red'
                } 
                if (machine_pred[j] == '5') {
                    txt = ' '
                    clr = 'white'
                }
                txtMachinePred[j] = txt
                const node1 = document.createTextNode(txt);
                flightPercent.appendChild(node1.cloneNode(true));
                flightPercent.style.backgroundColor = clr;
                const button = document.createElement("input");
                const node2 = document.createTextNode("click on me for more details");
                button.appendChild(node2.cloneNode(true));
                button.style.backgroundColor = "pink";
                button.id = `${i}`;
                button.type = "submit";
                button.value = "לחץ עליי לפרטים נוספים";

                slides[i].appendChild(flightPercent.cloneNode(true));
                slides[i].appendChild(button.cloneNode(true));
                console.log("added all buttons")
                var innerButton = document.getElementById(`${i}`)
                
                innerButton.addEventListener('click', e =>{
                    console.log(e.target.id);
                    clicked(e.target.id/2);
                })
                j = j + 1;
            }
            return false; 
        }, 3000);
    });
    
}

// when cliet click on button to move to the website
function clicked(i) {
    console.log(txtMachinePred)
    JSconfirm([allFlightsName[i], allFlightsOriginAirport[i].substring(1,4), allFlightsOriginTime[i] ,
    allFlightsDestAirport[i].substring(1,4), allFlightsDestTime[i], allFlightsDurations[i], txtMachinePred[i]], dayDeparture)
    console.log("Button clicked");
}

// popUp with all data of flight & send to website
function JSconfirm(info){
    console.log(info)
    new swal({
        title:'\n<pre style="text-align: Right";>' 
        + info[6]  + '<strong> :<u>החיזוי שלנו</u>\n</strong>'
        + info[0]  + '<strong> :<u>מספר טיסה</u>\n</strong>'
        + info[1] + '<strong> :<u>המראה משדה התעופה</u>\n</strong>'
        + dayDeparture + '<strong> :<u>ביום</u>\n</strong>'
        + info[2]+ '<strong> :<u>זמן המראה</u>\n</strong>' 
        + info[5].split('\n')[1] + '<strong> :<u>משך הטיסה</u>\n</strong>' 
        + info[3] + '<strong> :<u>נחיתה בשדה התעופה</u>\n</strong>' 
        + info[4] + '<strong> :<u>זמן נחיתה</u>\n</strong>'
        +'</pre>' + "?האם ברצונך לקבל עדכונים בזמן אמת",
       
        width: 600,
        padding: 100,
        background: '#fff url(https://mondo.co.il/wp-content/uploads/2016/08/bg.jpg)',
        showCancelButton: true,
        cancelButtonText: 'ביטול',
        confirmButtonText: 'כן',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'תודה שהשתמשתם בשירות שלנו',
                '',
                'success',
                window.open("http://134.122.56.202/")
            )}
    })
     
}

sendToServer();
