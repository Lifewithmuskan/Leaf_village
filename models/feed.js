const mongoose= require('mongoose');
const FeedData= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
});

const feed=mongoose.model('feed',FeedData);
module.exports=feed;