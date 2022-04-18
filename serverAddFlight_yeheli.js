const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient
// import * as $ from "jquery.js";
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const jquery = require('jquery')(dom.window)
var $ = require("jquery");
// var script = document.createElement('script');
// script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
// script.type = 'text/javascript';
var alert = require('alert');
// const ejs = require("ejs");
// var engines = require('consolidate');
// const html = require("html");

app.use(bodyParser.urlencoded({extended: true}));
const path = require('path');

app.use(express.static('./'));
app.use(express.static(__dirname));
// app.set('view engine', 'ejs');
// app.engine('html', engines.mustache);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// mongoose.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net/firstDB", {useNewUrlParser: true},{ useUnifiedTopology: true})

//creat schema
const notesSchema = {
    Email: String,
    flightNumber: String,
    Date: Date
}
//creat schema
const userSchema = {
    userName: String,
    Email: String,
    Password: String
}
var databaseInfo
var currentUserName
var currentEmail
var currentPassword
mongoose.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net/firstDB", {useNewUrlParser: true},{ useUnifiedTopology: true})
const Note = mongoose.model("Note", notesSchema);
const User = mongoose.model("User", userSchema);


// app.get("/", function(req, res){
//     res.sendFile(__dirname + "/addFlight.html")
// })

app.get("/addFlight.html", function(req, res){
    res.sendFile(__dirname + "/addFlight.html")
})

app.get("/", function(req, res){
    // res.sendFile(__dirname + "/addFlight.html")
    res.sendFile(__dirname + "/login.html")
})

app.get("/login.html", function(req, res){
    // res.sendFile(__dirname + "/addFlight.html")
    res.sendFile(__dirname + "/login.html")
})


app.get("/signin.html", function(req, res){
    res.sendFile(__dirname + "/signin.html")
})

app.get("/myFlights.html", function(req, res){
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    full = day + "/" + month + "/" + year 
    
    databaseInfo.collection('notes').find({}).toArray((err, result)=>{
        if(err) throw err
        res.render(__dirname + '/myflights.html', {full:full, items: result, Email: currentEmail});
    })
})

//OLD
app.get("/OLDmyFlights.html", function(req, res){
    
    databaseInfo.collection('notes').find({}).toArray((err, result)=>{
        if(err) throw err
        // res.render(__dirname + '/myflights.html', {items: result});
        let myTable="<style>\ntable {\n"+
        "border-collapse: ;\n"+
        "width: 100%;}\n"+
      
        "th, td {\n"+
        "text-align: left;\n"+
        "padding: 8px;}\n"+
      
        "tr:nth-child(even){background-color: #ffffff}\ntr:nth-child(odd){background-color: #fafafa96}\nth {\nbackground-color: #dd93f3;\ncolor: white;\n}\n</style>";
        myTable+= "<table style=\"width:100%\">\n";
        myTable+="<tr>\n<th>Flight number</th>\n<th>Date</th>\n";
        result.forEach(note =>{
            if( note.Email == currentEmail ){
                myTable+="<tr>\n";
                myTable += "<td>"+note.flightNumber+"</td>\n";
                myTable += "<td>"+note.Date+"</td>\n";
                myTable+="</tr>\n";
            }
        })
        // for (var flight in result) {
        //     myTable+="<tr>\n";
        //     // if( flight.Email == "123" ) {
        //         myTable += "<td>"+flight+"</td>\n";
        //         myTable += "<td>"+flight.Date.toString()+"</td>\n";
        //         // for(let [start,end] of jsonObject[p]){
        //         //     times+=start.toString()+"-"+end.toString()+",";
        //         // }
        //         // myTable += "<td>"+p+"</td>\n";
        //         // myTable+="<td>"+times+"</td>\n";
        //     // } 
        //     myTable+="</tr>\n";
        // } 
        res.send(myTable) ;
    })
    // var resultArray = [];
    // mongoose.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net/firstDB",function(err, db){
        
    //     var cursor = db.collection('firstDB').find();
        
    //     cursor.forEach(function(doc, err){
    //         resultArray.push(doc);
    //     }, function(){
    //         db.close();
    //         res.render(__dirname + '/myflights.html', {items: resultArray});
    //     });
    // });
    
})

app.post("/addFlight", function(req, res){
    let newNote = new Note({
        Email: currentEmail,
        flightNumber: req.body.flightNumber,
        Date: req.body.Date

    });
    newNote.save();
    console.log("added")
    // var popup = require('popups');

    // popup.alert({
    //     content: 'Hello!'
    // });
    alert("!הטיסה נוספה"); 
    res.redirect('/addFlight.html')
    
})

app.post("/signin", function(req, res){
    console.log("got in")
    let newUser = new User({
        userName: req.body.userName,
        Email: req.body.Email,
        Password: req.body.Password
        

    });
    newUser.save();
    console.log("added")
    res.redirect('/login.html')
})

app.post("/login", function(req, res){
    console.log("got in log in post")
    var flag = true;
    currentEmail = req.body.Email;
    currentPassword = req.body.Password;
    databaseInfo.collection('users').find({}).toArray((err, result)=>{
        if(err) throw err
        result.forEach(user =>{
            
            if (currentEmail == user.Email && currentPassword == user.Password){
                console.log('yes!')
                currentUserName = user.userName;
                res.redirect('/addFlight.html')
                flag = false
            }


        })
        if(flag){
            
            var message = "wrong email or password" 
            console.log(message)
            // window.document.addEventListener("DOMContentLoaded", () => {
            //     const loginForm=window.document.querySelector("#login");
            //     loginForm.classList.add("form--hidden");
            // });
            // res.send(message) ;
            alert("אימייל או הסיסמא שגויים"); 
            res.redirect('/')
        }

    })


    
    
})

app.get("/Report.html", function(req, res){
    databaseInfo.collection('users').find({}).toArray((err, result)=>{
        if(err) throw err
        console.log(currentEmail)
        res.render(__dirname + '/Report.html', {Email: currentEmail});
    })
    // res.sendFile(__dirname + "/Report.html")
})


// <%items.forEach(note =>{%>
//     <%if(note.Email == Email){%>
        
//         <% currentdate = note.Date%>
//         <% currentyear = currentdate.getFullYear();%>
//         <% currentmonth = currentdate.getMonth() + 1;%>
//         <% currentday = currentdate.getDate(); %>
//         <% currentfull = currentday + "/" + currentmonth + "/" + currentyear %>
//         <tr>
//             <th scope="row"><%= currentfull %></th> 
//             <th scope="row"><%= note.flightNumber %></th> 
            
//             <%if(currentfull < full){%>
//                 <th scope="row" ><a href="./Report.html" class="complain__button">!הגש תלונה</a></th> 
//             <%}%>
//         </tr>
    
//     <%}%>
//     <%})%>

var $ = require('jquery')(require('jsdom-no-contextify').jsdom().parentWindow);

// Support for Cross-domain request with using jQuery
// See: http://garajeando.blogspot.jp/2012/06/avoiding-xmlhttprequest-problem-using.html
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
$.support.cors = true;
$.ajaxSettings.xhr = function () {
	return new XMLHttpRequest;
}


app.listen(3000, function(){
    console.log("server is running on 3000")
    MongoClient.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net", {useNewUrlParser: true},(error,result)=>{
    if (error) throw error    
    databaseInfo = result.db('firstDB')
    })
    
    console.log("connection works!")
    
    // var loop = setInterval(hello,2000)
   
})
var count = 1
function notifyMe(){
    $.ajax({
        type: 'GET',
        url: 'https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=2030',
        success: function(flights) {
            var delayesFlights = []
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            today = yyyy + '-' + mm + '-' + dd;
            
            $.each(flights.result.records, function(i, flight){
                if (flight.CHSTOL.includes(today)){
                    if (flight.CHRMINH == "עיכוב"){
                        // console.log(i + ' ' + JSON.stringify(flight)+'\n')
                        delayesFlights.push(JSON.stringify({flightNumber: flight.CHOPER + flight.CHFLTN,
                                                            scheduledTime: flight.CHSTOL,
                                                            realTime: flight.CHPTOL}))
                    }
                }
                
            })
            console.log(delayesFlights)
            // databaseInfo.collection('notes').find({}).toArray((err, result)=>{
            //     if(err) throw err
            //     console.log(result)

            // })

        }
    });
}
notifyMe()
// var loop = setInterval(notifyMe,2000)


// function(flights) {
//     var delayesFlights = []
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     var yyyy = today.getFullYear();

//     today = yyyy + '-' + mm + '-' + dd;
    
//     $.each(flights.result.records, function(i, flight){
//         if (flight.CHSTOL.includes(today)){
//             if (flight.CHRMINH == "עיכוב"){
//                 // console.log(i + ' ' + JSON.stringify(flight)+'\n')
//                 delayesFlights.push(JSON.stringify(flight))
//             }
//         }
        
//     })
//     console.log(delayesFlights)
//     alert(delayesFlights)

// }
//OLD
// app.listen(3000, function(){
//     console.log("server is running on 3000")
//     MongoClient.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net", {useNewUrlParser: true},(error,result)=>{
//     if (error) throw error    
//     databaseInfo = result.db('firstDB')
//     })
    
//     console.log("connection works!")

// })