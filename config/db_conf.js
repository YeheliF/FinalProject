var Mongoose = require('mongoose').Mongoose;

const DB2 = new Mongoose();
const mongo_connection1 = () => {
    return DB2;
} 

module.exports = mongo_connection1

