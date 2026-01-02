import mongoose from 'mongoose';
const botschema = new mongoose.Schema({
   
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
const bot=mongoose.model('bot',botschema);
export default bot;