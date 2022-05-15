console.log('from background');

const allFlightsName = [];
const allFlightsOriginAirport = [];
const allFlightsDestAirport = [];
const allFlightsDurations = [];
const allFlightsPlanes = [];
const allFlightsDayDeparture = [];
const allFlightsOriginTime = [];
const allFlightsDestTime = [];
const overNight = [];

function sendToServer(){
    //////// send to server ////////////
    const paragraphs = document.getElementsByClassName("resultWrapper");

    for (flight of paragraphs) {
        flightName = flight.getElementsByClassName('codeshares-airline-names')[0];
        origin = flight.getElementsByClassName("airport-name")[0];
        destination = flight.getElementsByClassName("airport-name")[1];
        duration = flight.getElementsByClassName("top")[0];
        originTime = flight.getElementsByClassName("depart-time base-time")[0];
        destTime = flight.getElementsByClassName("arrival-time base-time")[0];
        oneway = flight.getElementsByClassName("container")[0];
        if (oneway.getElementsByClassName("adendum")[0] != null) {
            overNight.push(1);
        } else {
            overNight.push(0);
        }

        //     planes = flight.getElementsByClassName("af2q-equip-name")[0]
        //     dayOut = flight.getElementsByClassName("X3K_-header-text")[0]


        allFlightsName.push(flightName.innerHTML);
        allFlightsOriginAirport.push(origin.innerHTML);
        allFlightsDestAirport.push(destination.innerHTML);
        allFlightsDurations.push(duration.innerHTML);
        allFlightsOriginTime.push(originTime.innerHTML);
        allFlightsDestTime.push(destTime.innerHTML);
        //     allFlightsPlanes.push(planes.innerText)
        //     allFlightsDayDeparture.push(dayOut.innerText)
    }


    console.log(allFlightsName.join('\n'));
    console.log(allFlightsOriginAirport.join('\n'));
    console.log(allFlightsDestAirport.join('\n'));
    console.log(allFlightsDurations.join('\n'));
    console.log(allFlightsOriginTime.join('\n'));
    console.log(allFlightsDestTime.join('\n'));
    console.log(overNight.join('\n'));
        // console.log(allFlightsDayDeparture.join('\n'))
        // console.log(allFlightsPlanes.join('\n'))
    // console.log(tryMe.join('\n'))
    // });
}
function CreatElements(){
    ///////// creat elements////////
    const flightPercent = document.createElement('div');
    const node1 = document.createTextNode("percents of delay:");
    flightPercent.appendChild(node1.cloneNode(true));
    flightPercent.style.backgroundColor = "green";


    const button = document.createElement("input");
    const node2 = document.createTextNode("click on me for more details");
    button.appendChild(node2.cloneNode(true));
    button.style.backgroundColor = "pink";
    button.id = "websiteButton";
    button.type = "submit";
    button.value = "click on me for more details";


    // const button = document.createElement("input");
    // button.value = "click on me for more details";
    // button.id = "websiteButton";
    // button.type = "submit";
    // button.style.backgroundColor = "pink";

    const slides = document.getElementsByClassName('top-row');

    document.addEventListener('mouseenter', (event)=>{
        console.log('got into event listener');
        for (var i = 0; i < slides.length; i = i+2) {
            slides[i].appendChild(flightPercent.cloneNode(true));
            slides[i].appendChild(button.cloneNode(true));
            i=0
        }
        
        document.getElementById("websiteButton").addEventListener("click", function (req,res){
            var information = 'Flight Name: ' + allFlightsName[0] + '\nFrom: ' + allFlightsOriginAirport[0].substring(1,4) + "\nTime: "
            + allFlightsOriginTime[0] + "\nTo: " + allFlightsDestAirport[0].substring(1,4) + "\narrivale time: " + allFlightsDestTime[0]
            // information.style.backgroundColor = "#fff173"

            const info = document.createElement('div');
            const node = document.createTextNode('');
            info.value=information
            info.appendChild(node.cloneNode(true));
            info.style.backgroundColor = "green";
            
            if (confirm(info.value)) {
                    window.open("http://134.122.56.202/")
            } else {
                console.log("goodbey!")
            }
            console.log("Button clicked");
            // const loginForm=document.querySelector("#login").style.visibility="visible";
            // console.log(loginForm);
            // loginForm.classList.add("active");
        })

    });
}


sendToServer();
CreatElements();