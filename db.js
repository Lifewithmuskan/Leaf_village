const mongoose =require('mongoose');
//const mongo_URL=process.env.db_URL;
const mongo_URL=process.env.onlinedb_url;
//set mongoose connection

mongoose.connect(mongo_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

//define the listeners for database

db.on('connected',()=>{
    console.log("connection to mongodatabse")
});

db.on('disconnected',()=>{
    console.log("disconnected to mongodatabse")
});

db.on('error',(error)=>{
    console.log(error,"Error ->(connection to mongodatabse falied)")
});

module.exports={
    db: db
};