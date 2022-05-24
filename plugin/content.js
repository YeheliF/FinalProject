const allFlightsName = [];
const allFlightsOriginAirport = [];
const allFlightsDestAirport = [];
const allFlightsDurations = [];
const allFlightsOriginTime = [];
const allFlightsDestTime = [];
const overNight = [];

const dayDeparture = window.location.href.split('/')[5]
const dayArrival = window.location.href.split('/')[6].split('?')[0]


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
function clicked(i) {
    // var information = 'Flight Name: ' + allFlightsName[i] + '\nFrom: ' + allFlightsOriginAirport[i].substring(1,4) + "\nTime: "
    // + allFlightsOriginTime[i] + "\nTo: " + allFlightsDestAirport[i].substring(1,4) + "\narrivale time: " + allFlightsDestTime[i]
    // console.log(information)

    // const info = document.createElement('div');
    // const node = document.createTextNode('');
    // info.value= information
    // info.appendChild(node.cloneNode(true));
    // info.style.backgroundColor = "green";
    
    JSconfirm([allFlightsName[i],allFlightsOriginAirport[i].substring(1,4),allFlightsOriginTime[i] ,
    allFlightsDestAirport[i].substring(1,4),allFlightsDestTime[i],allFlightsDurations[i]], dayDeparture, dayArrival)
    // if (confirm(info.value)) {
    //         window.open("http://134.122.56.202/")
    // } else {
    //     console.log("goodbey!")
    // }
    console.log("Button clicked");
}
function CreatElements() {
    ///////// creat elements////////
    

    
    const slides = document.getElementsByClassName('top-row');
    $(document).ready(function () {
        setTimeout(function(){
            
            for (var i = 0; i < slides.length; i = i+2) {
                console.log("in loop")
                const flightPercent = document.createElement('div');
                const node1 = document.createTextNode("Percents of delay:");
                flightPercent.appendChild(node1.cloneNode(true));
                flightPercent.style.backgroundColor = "green";
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
                }) //clicked(allFlightsName.indexOf( e.target.flightName)));
            
            }
           
            
            return false; 
        },2000);
    });
    
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const allFlightsName = [];
// const allFlightsOriginAirport = [];
// const allFlightsDestAirport = [];
// const allFlightsDurations = [];
// const allFlightsPlanes = [];
// const allFlightsDayDeparture = [];
// const allFlightsOriginTime = [];
// const allFlightsDestTime = [];
// const overNight = [];

// // function search() {
// //     chrome.tabs.executeScript({file: 'jquery.min.js'});
// // }

// function sendToServer(){
//     const paragraphs = document.getElementsByClassName("resultWrapper");

//     for (flight of paragraphs) {
//         flightName = flight.getElementsByClassName('codeshares-airline-names')[0];
//         origin = flight.getElementsByClassName("airport-name")[0];
//         destination = flight.getElementsByClassName("airport-name")[1];
//         duration = flight.getElementsByClassName("top")[0];
//         originTime = flight.getElementsByClassName("depart-time base-time")[0];
//         destTime = flight.getElementsByClassName("arrival-time base-time")[0];
//         oneway = flight.getElementsByClassName("container")[0];
//         if (oneway.getElementsByClassName("adendum")[0] != null) {
//             overNight.push(1);
//         } else {
//             overNight.push(0);
//         }

//         //     planes = flight.getElementsByClassName("af2q-equip-name")[0]
//         //     dayOut = flight.getElementsByClassName("X3K_-header-text")[0]


//         allFlightsName.push(flightName.innerHTML);
//         allFlightsOriginAirport.push(origin.innerHTML);
//         allFlightsDestAirport.push(destination.innerHTML);
//         allFlightsDurations.push(duration.innerHTML);
//         allFlightsOriginTime.push(originTime.innerHTML);
//         allFlightsDestTime.push(destTime.innerHTML);
//         //     allFlightsPlanes.push(planes.innerText)
//         //     allFlightsDayDeparture.push(dayOut.innerText)
//     }


//     console.log(allFlightsName.join('\n'));
//     console.log(allFlightsOriginAirport.join('\n'));
//     console.log(allFlightsDestAirport.join('\n'));
//     console.log(allFlightsDurations.join('\n'));
//     console.log(allFlightsOriginTime.join('\n'));
//     console.log(allFlightsDestTime.join('\n'));
//     console.log(overNight.join('\n'));
//         // console.log(allFlightsDayDeparture.join('\n'))
//         // console.log(allFlightsPlanes.join('\n'))
//     // console.log(tryMe.join('\n'))
//     // });
// }
// function clicked(i) {
//     console.log(i)
//     console.log('Flight Name: ' + allFlightsName[i])
//     console.log('From: ' + allFlightsOriginAirport[i].substring(1,4))
//     console.log('Time: ' + allFlightsOriginTime[i])
//     // console.log($('button').index($(this)))
//     // var information = 'Flight Name: ' + allFlightsName[i] + '\nFrom: ' + allFlightsOriginAirport[i].substring(1,4) + "\nTime: "
//     // + allFlightsOriginTime[i] + "\nTo: " + allFlightsDestAirport[i].substring(1,4) + "\narrivale time: " + allFlightsDestTime[i]
//     // information.style.backgroundColor = "#fff173"

//     const info = document.createElement('div');
//     const node = document.createTextNode('');
//     info.value= "x" //information
//     info.appendChild(node.cloneNode(true));
//     info.style.backgroundColor = "green";
    
//     // JSconfirm()
//     if (confirm(info.value)) {
//             window.open("http://134.122.56.202/")
//     } else {
//         console.log("goodbey!")
//     }
//     console.log("Button clicked");
// }
// function CreatElements(){
//     ///////// creat elements////////
//     const flightPercent = document.createElement('div');
//     const node1 = document.createTextNode("Percents of delay:");
//     flightPercent.appendChild(node1.cloneNode(true));
//     flightPercent.style.backgroundColor = "green";


//     const button = document.createElement("input");
//     const node2 = document.createTextNode("click on me for more details");
//     button.appendChild(node2.cloneNode(true));
//     button.style.backgroundColor = "pink";
//     button.id = "websiteButton";
//     button.type = "submit";
//     button.value = "לחץ עליי לפרטים נוספים";


//     // const button = document.createElement("input");
//     // button.value = "click on me for more details";
//     // button.id = "websiteButton";
//     // button.type = "submit";
//     // button.style.backgroundColor = "pink";

//     const slides = document.getElementsByClassName('top-row');
//     console.log("after slides")
//     $(document).ready(function () {
//         setTimeout(function(){
//     // $( window ).on( "load", function(){

//         console.log("after ready")
//         for (var i = 0; i < slides.length; i = i+2) {
//             console.log("in loop")
//             slides[i].appendChild(flightPercent.cloneNode(true));
//             slides[i].appendChild(button.cloneNode(true));
//         }
//         console.log("added all buttons")
//         //////one shot
//         // eachButton = document.getElementsByClassName("websiteButton");
//         // for (var i = 0; i < eachButton.length; i++){
//         //     console.log("onclick {}".i)
//         //     $(eachButton.item[i]).on("click", "a", function (e) {
//         //         e.preventDefault()
//         //         console.log("flicked!")
//         //         // var information = 'Flight Name: ' + allFlightsName[0] + '\nFrom: ' + allFlightsOriginAirport[0].substring(1,4) + "\nTime: "
//         //         // + allFlightsOriginTime[0] + "\nTo: " + allFlightsDestAirport[0].substring(1,4) + "\narrivale time: " + allFlightsDestTime[0]
//         //         // // information.style.backgroundColor = "#fff173"

//         //         // const info = document.createElement('div');
//         //         // const node = document.createTextNode('');
//         //         // info.value=information
//         //         // info.appendChild(node.cloneNode(true));
//         //         // info.style.backgroundColor = "green";
                
//         //         // // JSconfirm()
//         //         // if (confirm(info.value)) {
//         //         //         window.open("http://134.122.56.202/")
//         //         // } else {
//         //         //     console.log("goodbey!")
//         //         // }
//         //         // console.log("Button clicked");
//         //     });
//         // };
//         //////second shot
//         var allButtons = document.querySelectorAll('#websiteButton')
//         for ( var i =0;i<allButtons.length -1;i++){
//             console.log(allButtons[i]);
//             allButtons[i].addEventListener('click', e =>{console.log(e.target)}) //clicked(allFlightsName.indexOf( e.target.flightName)));
            
//         }
//         return false; },2000);
//     });
//     /////OLD///////
//     // document.addEventListener('mouseenter', (event)=>{
//     //     console.log('got into event listener');
//     //     for (var i = 0; i < slides.length; i = i+2) {
//     //         slides[i].appendChild(flightPercent.cloneNode(true));
//     //         slides[i].appendChild(button.cloneNode(true));
//     //         i=0
//     //     }
        
//     //     document.getElementById("websiteButton").addEventListener("click", function (req,res){
//     //         var information = 'Flight Name: ' + allFlightsName[0] + '\nFrom: ' + allFlightsOriginAirport[0].substring(1,4) + "\nTime: "
//     //         + allFlightsOriginTime[0] + "\nTo: " + allFlightsDestAirport[0].substring(1,4) + "\narrivale time: " + allFlightsDestTime[0]
//     //         // information.style.backgroundColor = "#fff173"

//     //         const info = document.createElement('div');
//     //         const node = document.createTextNode('');
//     //         info.value=information
//     //         info.appendChild(node.cloneNode(true));
//     //         info.style.backgroundColor = "green";
            
//     //         // JSconfirm()
//     //         if (confirm(info.value)) {
//     //                 window.open("http://134.122.56.202/")
//     //         } else {
//     //             console.log("goodbey!")
//     //         }
//     //         console.log("Button clicked");
//     //     })
//     // });
// }
function JSconfirm(info){
    // var information = 'Flight Name: ' + allFlightsName[i] + '\nFrom: ' + allFlightsOriginAirport[i].substring(1,4) + "\nTime: "
    // + allFlightsOriginTime[i] + "\nTo: " + allFlightsDestAirport[i].substring(1,4) + "\narrivale time: " + allFlightsDestTime[i]
   
    new swal({
        // text:"?האם אתה מעוניין לעבור אל האתר שלנו על מנת לקבל פרטים נוספים",
        title:"האם אתה מעוניין לעבור אל האתר שלנו\n ?על מנת לקבל פרטים נוספים" +  '\n<pre style="text-align: Right";>' 
        + info[0]  + '<strong> :<u>מספר טיסה</u>\n</strong>'
        + info[1] + '<strong> :<u>המראה משדה התעופה</u>\n</strong>'
        + dayDeparture + '<strong> :<u>ביום</u>\n</strong>'
        + info[2]+ '<strong> :<u>זמן נחיתה</u>\n</strong>' 
        + info[5].split('\n')[1] + '<strong> :<u>משך הטיסה</u>\n</strong>' 
        + info[3] + '<strong> :<u>נחיתה בשדה התעופה</u>\n</strong>' 
        + dayArrival + '<strong> :<u>ביום</u>\n</strong>'
        + info[4] + '<strong> :<u>זמן נחיתה</u>\n</strong>'
        +'</pre>',
        
        // html: $('<h2>')
        // .addClass('some-class')
        // .text('Flight Name: ' + x + '\n' +'From: ' + x + "\nTime: "),
        // + allFlightsOriginTime[i] + "\nTo: " + allFlightsDestAirport[i].substring(1,4) + "\narrivale time: " + allFlightsDestTime[i]) ,
        // html: $('<h3>').addClass('x').text('hiiiiiiii'),
        // type: 'question',
        // text: info,
        width: 600,
        padding: 100,
        background: '#fff url(//bit.ly/1Nqn9HU)',
        showCancelButton: true,
        cancelButtonText: 'ביטול',
        confirmButtonText: 'כן',
        customClass: {
            container: '...',
            popup: '...',
            header: '...',
            title: '...',
            closeButton: '...',
            icon: '...',
            image: '...',
            content: '...',
            htmlContainer: '...',
            input: '...',
            inputLabel: '...',
            validationMessage: '...',
            actions: '...',
            confirmButton: '...',
            denyButton: '...',
            cancelButton: '...',
            loader: '...',
            footer: '....',
            timerProgressBar: '....',
          },
        // showLoaderOnConfirm: true,
        
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'תודה שהשתמשתם בשירות שלנו',
                '',
                'success',
                window.open("http://134.122.56.202/")
            )
            // new swal({html: [window.open("http://134.122.56.202/"),'<pre>' + '<strong><u>תודה</u>: </strong></pre>']
        }
    })
     
}

// search()
sendToServer();
CreatElements();