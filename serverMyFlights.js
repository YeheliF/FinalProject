const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");


app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://yeheli:yeheli123@flightperdiction.i2rhz.mongodb.net/firstDB", {useNewUrlParser: true},{ useUnifiedTopology: true})

//creat schema
const notesSchema = {
    flightNumber: String,
    Date: Date
}

const note = mongoose.model('Note', notesSchema)

app.get("/", function(req, res){
    note.find({}, function(err, notes){
        res.render('myflights',{
            notesList: notes
        })
    })
    
})

app.listen(3000, function(){
    console.log("server is running on 3000")
})