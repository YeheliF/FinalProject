var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new mongoose.Schema( {
	
	unique_id: Number,
	// email: String,
	// username: String,
	// password: String,
	Email: String,
	userName: String,
    Password: String,
	PasswordConf: String
})

module.exports = mongoose.model('User', userSchema)
