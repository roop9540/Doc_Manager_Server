const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    required:true},
    username:{
        type: String,
    required:true},
    password:{
        type: String,
    required:true},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    
})

module.exports.USER = new mongoose.model("user", userSchema)