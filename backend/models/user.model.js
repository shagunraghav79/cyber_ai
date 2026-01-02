import mongoose from 'mongoose';
const userschema = new mongoose.Schema({
    sender:{
        type:String,
        required:true,
        enum:["user"]
    },
    text:
    {
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }


});
const user=mongoose.model('user',userschema);
export default user;