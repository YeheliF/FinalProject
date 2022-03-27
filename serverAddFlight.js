const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient
var alert = require('alert');
// const ejs = require("ejs");
// var engines = require('consolidate');
// const html = require("html");

app.use(bodyParser.urlencoded({extended: true}));
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
    console.log("got in")
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
    res.sendFile(__dirname + "/Report.html")
})

app.listen(3000, function(){
    console.log("server is running on 3000")
    MongoClient.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net", {useNewUrlParser: true},(error,result)=>{
    if (error) throw error    
    databaseInfo = result.db('firstDB')
    })
    
    console.log("connection works!")

})