var Mongoose = require('mongoose').Mongoose;
var instance2 = require('./db_conf')
const connectDB = async () => {
    try{
        const conn = await instance2().connect(process.env.MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true
        })

    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}
module.exports = connectDB