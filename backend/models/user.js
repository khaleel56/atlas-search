const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const _schema = new Schema({
    userName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model('user', _schema)