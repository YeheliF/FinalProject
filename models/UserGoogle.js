const mongoose = require('mongoose')
var instance2 = require('../config/db_conf')

const UserSchemaGoogle = new mongoose.Schema({
    googleId:{
        type: String,
        required: true
    },
    displayName:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    image:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

// UserSchemaGoogle.plugin(findOrCreate)
module.exports = instance2().model('UserGoogle', UserSchemaGoogle)