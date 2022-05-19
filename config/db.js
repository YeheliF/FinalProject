var Mongoose = require('mongoose').Mongoose;
var instance2 = require('./db_conf')

// export const instance2 = new Mongoose();
// // console.log("test");
// const retDB = () => {
//     return instance2
// }
// mongoose.connect(
//     'mongodb+srv://liad:liad@cluster0.w0cf6.mongodb.net/users?retryWrites=true&w=majority',
//     {
//         useNewUrlParser: true,
//         //useFindAndModify: false,
//         useUnifiedTopology: true
//     }
// );

// const db = mongoose.connection;
// db.on("error", console.log.bind(console, "connection error: "));
// db.once("open", function() {
//     console.log("Connected successfully");
// });
const connectDB = async () => {
    try{
        const conn = await instance2().connect(process.env.MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true
        })
        console.log('mongo connected:')
        console.log(conn.connection.host)

    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}
module.exports = connectDB