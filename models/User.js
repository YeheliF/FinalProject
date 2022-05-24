var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var instance2 = require('../config/db_conf')

userSchema = new mongoose.Schema( {
	
	unique_id:{
		type: Number
	}, 
	// email: String,
	// username: String,
	// password: String,
	Email:{
		type:String,
		required: true
	}, 
	userName:{
		type:String,
		required: true
	},
	type:{
		type:String,
		required: true
	},
    Password: {
		type:String
	}, 
	PasswordConf: {
		type:String

	},
	createdAt:{
        type: Date,
        default: Date.now
    },
	resetLink: {
		type: String,
		default:''
	}
},{timestamps: true})

module.exports = instance2().model('User', userSchema)
